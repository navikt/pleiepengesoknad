import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikInputGroup, FormikTimeInput } from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { Daginfo, Ukeinfo } from '@navikt/sif-common-pleiepenger/lib/types/tidUkerTypes';
import { dateFormatter, Duration, isDateInDates, isDateInWeekdays, Weekday } from '@navikt/sif-common-utils';
import { Normaltekst } from 'nav-frontend-typografi';

export type ArbeidstidUkeInputEnkeltdagValidator = (dato: Date) => (value: Duration) => ValidationError | undefined;

export interface ArbeidstidUkeTekster {
    dag: React.ReactNode;
    jobber: React.ReactNode;
    ariaLabelTidInput: (dato: string) => React.ReactNode;
}
interface Props {
    getFieldName: (dag: Daginfo) => string;
    ukeinfo: Ukeinfo;
    utilgjengeligeDatoer?: Date[];
    utilgjengeligeUkedager?: Weekday[];
    tekst: ArbeidstidUkeTekster;
    enkeltdagValidator?: ArbeidstidUkeInputEnkeltdagValidator;
    ukeTittelRenderer?: (uke: Ukeinfo) => React.ReactNode;
    dagLabelRenderer?: (dag: Daginfo) => React.ReactNode;
}

const bem = bemUtils('arbeidstidUkerInput');

const ArbeidstidUkeInput: React.FunctionComponent<Props> = ({
    ukeinfo,
    utilgjengeligeDatoer,
    utilgjengeligeUkedager,
    getFieldName,
    enkeltdagValidator: enkeltdagValidator,
    ukeTittelRenderer,
    tekst,
}) => {
    const { dager } = ukeinfo;

    return (
        <div className={bem.element('uke')}>
            {ukeTittelRenderer ? (
                ukeTittelRenderer(ukeinfo)
            ) : (
                <Normaltekst tag="h3" style={{ fontSize: '1.125rem', marginBottom: '1rem', marginTop: '1.5rem' }}>
                    {getUkeTittel(ukeinfo)}
                </Normaltekst>
            )}

            <div className={bem.element('uke__ukedager')}>
                <div className={bem.element('dag-inputs', 'header')}>
                    <div className={bem.element('dagnavn', 'header')}>{tekst.dag}</div>
                    <div className={bem.element('arbeidstidPeriode')} id="iPerioden">
                        {tekst.jobber}
                    </div>
                </div>
                {dager.map((dag) => {
                    const erUtilgjengeligDato = isDateInDates(dag.dato, utilgjengeligeDatoer);
                    const erUtilgjengeligUkedag = utilgjengeligeUkedager
                        ? isDateInWeekdays(dag.dato, utilgjengeligeUkedager)
                        : false;
                    if (erUtilgjengeligDato || erUtilgjengeligUkedag) {
                        return null;
                    }
                    const dayDateString = inputDatoLabel(dag.dato);
                    return (
                        <FormikInputGroup
                            key={dag.isoDate}
                            legend={<span className="sr-only">{dayDateString}</span>}
                            name={'arbeidstid'}
                            className={bem.element('dag', erUtilgjengeligDato ? 'utilgjengelig' : undefined)}>
                            <div className={bem.element('dag-inputs')}>
                                <div className={bem.element('dagnavn')} role="presentation" aria-hidden={true}>
                                    {dayDateString}
                                </div>
                                <div className={bem.element('arbeidstidPeriode')}>
                                    <FormikTimeInput
                                        aria-describedby="iPerioden"
                                        name={getFieldName(dag)}
                                        label={
                                            <span className={'sr-only'}>{tekst.ariaLabelTidInput(dayDateString)}</span>
                                        }
                                        timeInputLayout={{
                                            direction: 'horizontal',
                                        }}
                                        validate={enkeltdagValidator ? enkeltdagValidator(dag.dato) : undefined}
                                    />
                                </div>
                            </div>
                        </FormikInputGroup>
                    );
                })}
            </div>
        </div>
    );
};

const inputDatoLabel = (date: Date): string => dateFormatter.dayDateAndMonth(date);

const getUkeTittel = ({ ukenummer, år }: Ukeinfo): string => {
    return `Uke ${ukenummer}, ${år}`;
};

export default ArbeidstidUkeInput;
