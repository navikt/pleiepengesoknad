import React from 'react';
import { useIntl } from 'react-intl';
import { useMediaQuery } from 'react-responsive';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import {
    DateRange,
    dateToISOString,
    FormikTimeInput,
    getTypedFormComponents,
    Time,
} from '@navikt/sif-common-formik/lib';
import { TimeInputLayoutProps } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import groupby from 'lodash.groupby';
import { ISODateString } from 'nav-datovelger/lib/types';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { TidIOmsorgstilbud } from './types';
import { Close } from '@navikt/ds-icons';

import './omsorgstilbudForm.less';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

interface Props {
    fraDato: Date;
    tilDato: Date;
    tidIOmsorgstilbud: TidIOmsorgstilbud;
    onSubmit: (tidIOmsorgstilbud: TidIOmsorgstilbud) => void;
    onCancel?: () => void;
}

enum FormField {
    tidIOmsorg = 'tidIOmsorg',
}
interface FormValues {
    [FormField.tidIOmsorg]: TidIOmsorgstilbud;
}

export interface Daginfo {
    isoDateString: ISODateString;
    dato: Date;
    ukedag: number;
    årOgUke: string;
    ukenummer: number;
    år: number;
    labelDag: string;
    labelDato: string;
    labelFull: string;
    tid?: Time;
}

interface Ukeinfo {
    år: number;
    ukenummer: number;
    dager: Daginfo[];
}

type DagLabelRenderer = (dag: Daginfo) => React.ReactNode;

// -- UTILS -----------------------------

export const getOmsorgstilbudTidFieldName = (fieldName: string, dag: Daginfo): string =>
    `${fieldName}.${dag.isoDateString}`;

const getDagInfo = (date: Date): Daginfo => {
    const dayjsDato = dayjs(date);
    return {
        isoDateString: dateToISOString(dayjsDato.toDate()),
        dato: dayjsDato.toDate(),
        ukedag: dayjsDato.isoWeekday(),
        ukenummer: dayjsDato.isoWeek(),
        år: dayjsDato.year(),
        årOgUke: `${dayjsDato.year()}.${dayjsDato.isoWeek()}`,
        labelDag: `${dayjsDato.format('dddd')}`,
        labelDato: `${dayjsDato.format('DD.MM.YYYY')}`,
        labelFull: `${dayjsDato.format('dddd')} ${dayjsDato.format('DD. MMM')}`,
    };
};

export const getDatoerForOmsorgstilbudPeriode = (from: Date, to: Date): Daginfo[] => {
    const dager: Daginfo[] = [];
    let dayjsDato = dayjs(from);
    while (dayjsDato.isSameOrBefore(to, 'day')) {
        const ukedag = dayjsDato.isoWeekday();
        if (ukedag <= 5) {
            dager.push(getDagInfo(dayjsDato.toDate()));
        }
        dayjsDato = dayjsDato.add(1, 'day');
    }
    return dager;
};

const getEmptyElements = (num: number): JSX.Element[] | undefined => {
    return num === 0
        ? undefined
        : Array.from({ length: num }).map((_, index) => React.createElement('span', { key: index }));
};

const getUker = (dager: Daginfo[]): Ukeinfo[] => {
    const ukerOgDager = groupby(dager, (dag) => dag.årOgUke);
    const uker = Object.keys(ukerOgDager).map((key): Ukeinfo => {
        const dagerIUke = ukerOgDager[key];
        return { år: dagerIUke[0].år, ukenummer: dagerIUke[0].ukenummer, dager: dagerIUke };
    });
    return uker;
};

const getTimeInputLayout = (isNarrow: boolean, isWide: boolean): TimeInputLayoutProps => ({
    justifyContent: 'right',
    direction: isNarrow || isWide ? 'vertical' : 'horizontal',
});

const getTidIOmsorgValidator = (dag: Daginfo) => (tid: Time) => {
    const error = getTimeValidator({
        required: false,
        max: { hours: 7, minutes: 30 },
    })(tid);
    return error
        ? {
              key: `omsorgstilbud.validation.${error}`,
              values: {
                  dag: dag.labelFull,
                  maksTimer: 7,
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};

// -- Component -----------------------------

const Form = getTypedFormComponents<FormField, FormValues, ValidationError>();

const bem = bemUtils('omsorgstilbudForm');

const OmsorgstilbudForm = ({ fraDato, tilDato, tidIOmsorgstilbud, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const isNarrow = useMediaQuery({ maxWidth: 450 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const datoerIForm = getDatoerForOmsorgstilbudPeriode(fraDato, tilDato);

    const uker = getUker(datoerIForm);

    if (dayjs(fraDato).isAfter(tilDato)) {
        return <div>Fra dato er før til-dato</div>;
    }

    const onFormikSubmit = ({ tidIOmsorg = {} }: Partial<FormValues>) => {
        onSubmit(tidIOmsorg);
    };

    return (
        <Normaltekst tag="div" className={bem.block}>
            <Form.FormikWrapper
                initialValues={{ tidIOmsorg: tidIOmsorgstilbud }}
                onSubmit={onFormikSubmit}
                renderForm={() => {
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'tidsperiodeForm')}
                            includeButtons={true}>
                            <Systemtittel tag="h1">Omsorgstilbud - {dayjs(fraDato).format('MMMM YYYY')}</Systemtittel>
                            <Box margin="l">
                                <p>
                                    Fyll ut antall timer og minutter de dagene barnet skal være i omsorgstilbud. Dager
                                    hvor barnet ikke skal være i omsorgstilbud, trenger du ikke fylle ut noe.
                                </p>
                                <p>
                                    <strong>Du kan registrere opp til 7 timer og 30 minutter på én dag.</strong>
                                </p>
                            </Box>
                            <div>
                                {uker.map((week) => {
                                    return (
                                        <Box key={week.ukenummer} margin="m">
                                            <OmsorgstilbudUkeForm
                                                getFieldName={(dag: Daginfo) =>
                                                    getOmsorgstilbudTidFieldName(FormField.tidIOmsorg, dag)
                                                }
                                                ukeinfo={week}
                                                isNarrow={isNarrow}
                                                isWide={isWide}
                                            />
                                        </Box>
                                    );
                                })}
                            </div>
                        </Form.Form>
                    );
                }}
            />
        </Normaltekst>
    );
};

// -- Sub components -----------------------------

interface OmsorgstilbudInlineFormProps {
    fieldName: string;
    søknadsperiode: DateRange;
    ukeTittelRenderer?: OmsorgstilbudUkeTittelRenderer;
}

export const OmsorgstilbudInlineForm: React.FunctionComponent<OmsorgstilbudInlineFormProps> = ({
    fieldName,
    søknadsperiode,
    ukeTittelRenderer,
}) => {
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const datoer = getDatoerForOmsorgstilbudPeriode(søknadsperiode.from, søknadsperiode.to);
    const uker = getUker(datoer);

    return (
        <div className={bem.classNames(bem.block, bem.modifier('inlineForm'))}>
            {uker.map((week) => {
                return (
                    <Box key={week.ukenummer} margin="m">
                        <OmsorgstilbudUkeForm
                            getFieldName={(dag) => getOmsorgstilbudTidFieldName(fieldName, dag)}
                            ukeinfo={week}
                            isNarrow={isNarrow}
                            isWide={isWide}
                            tittelRenderer={ukeTittelRenderer}
                        />
                    </Box>
                );
            })}
        </div>
    );
};

const DagLabel = ({ dag, customRenderer }: { dag: Daginfo; customRenderer?: DagLabelRenderer }): JSX.Element => {
    return (
        <span className={bem.element('dag__label')}>
            {customRenderer ? (
                customRenderer(dag)
            ) : (
                <>
                    <span className={bem.element('dag__label__dagnavn')}>{dag.labelDag}</span>
                    <span className={bem.element('dag__label__dato')}>{dag.labelDato}</span>
                </>
            )}
        </span>
    );
};

// -- Sub components -----------------------------

type OmsorgstilbudUkeTittelRenderer = (ukeinfo: Ukeinfo) => React.ReactNode;

const getForegåendeDagerIUke = (dag: Daginfo): Daginfo[] => {
    const dager = getEmptyElements(dag.ukedag - 1);
    if (dager && dager.length > 0) {
        const firstDayOfWeek = dayjs(dag.dato).subtract(dag.ukedag - 1, 'days');
        return dager.map((c, idx) => {
            const date = firstDayOfWeek.add(idx, 'days').toDate();
            return getDagInfo(date);
        });
    }
    return [];
};

interface OmsorgstilbudUkeFormProps {
    getFieldName: (dag: Daginfo) => string;
    ukeinfo: Ukeinfo;
    isNarrow: boolean;
    isWide: boolean;
    tittelRenderer?: OmsorgstilbudUkeTittelRenderer;
    dagLabelRenderer?: DagLabelRenderer;
}

const OmsorgstilbudUkeForm: React.FunctionComponent<OmsorgstilbudUkeFormProps> = ({
    ukeinfo,
    getFieldName,
    tittelRenderer,
    dagLabelRenderer,
    isNarrow,
    isWide,
}) => {
    const { dager, ukenummer, år } = ukeinfo;

    return (
        <ResponsivePanel className={bem.element('uke')}>
            {tittelRenderer ? (
                tittelRenderer(ukeinfo)
            ) : (
                <Undertittel tag="h3">
                    Uke {ukenummer}, {år}
                </Undertittel>
            )}
            <div className={bem.element('uke__ukedager', isWide ? 'grid' : 'liste')}>
                {getForegåendeDagerIUke(dager[0]).map((dag) => (
                    <div
                        className={bem.element('dag', 'utenforPeriode')}
                        key={dag.isoDateString}
                        role="presentation"
                        aria-hidden={true}>
                        <DagLabel dag={dag} customRenderer={dagLabelRenderer} />
                        <div className={bem.element('dag__utenforPeriodeIkon')}>
                            <Close />
                        </div>
                    </div>
                ))}
                {dager.map((dag) => (
                    <div key={dag.isoDateString} className={bem.element('dag')}>
                        <FormikTimeInput
                            name={getFieldName(dag)}
                            label={<DagLabel dag={dag} key={dag.isoDateString} customRenderer={dagLabelRenderer} />}
                            timeInputLayout={getTimeInputLayout(isNarrow, isWide)}
                            validate={getTidIOmsorgValidator(dag)}
                        />
                    </div>
                ))}
            </div>
        </ResponsivePanel>
    );
};

export default OmsorgstilbudForm;
