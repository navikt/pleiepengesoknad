import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, getTypedFormComponents, InputTime } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { InputDateString } from 'nav-datovelger/lib/types';
import { Undertittel } from 'nav-frontend-typografi';
import { DagMedTid } from '../../types';
import dateFormatter from '../../utils/dateFormatterUtils';

interface Props {
    dagMedTid: DagMedTid;
    arbeidsstedNavn: string;
    periode: DateRange;
    onSubmit: (data: ArbeidstidEnkeltdagEndring) => void;
    onCancel: () => void;
}

const includeSkalIkkeJobbe = false;

export interface GjentagelseEnkeltdag {
    gjentagelsetype: GjentagelseType;
    tom?: Date;
}

export interface ArbeidstidEnkeltdagEndring {
    dagMedTid: DagMedTid;
    gjelderFlereDager?: GjentagelseEnkeltdag;
}

enum FormFields {
    'tid' = 'tid',
    'skalIkkeJobbe' = 'skalIkkeJobbe',
    'skalGjentas' = 'skalGjentas',
    'gjentagelse' = 'gjentagelse',
    'stopGjentagelse' = 'stopGjentagelse',
    'stopDato' = 'stopDato',
}

export enum GjentagelseType {
    hverUke = 'hverUke',
    hverAndreUke = 'hverAndreUke',
    heleUken = 'heleUken',
    heleMåneden = 'heleMåneden',
}

interface FormValues {
    [FormFields.tid]: InputTime;
    [FormFields.skalGjentas]: boolean;
    [FormFields.skalIkkeJobbe]: boolean;
    [FormFields.gjentagelse]: GjentagelseType;
    [FormFields.stopGjentagelse]: boolean;
    [FormFields.stopDato]: InputDateString;
}

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const bem = bemUtils('arbeidstidEnkeltdagEdit');

const ArbeidstidEnkeltdagForm: React.FunctionComponent<Props> = ({
    dagMedTid: { dato, tid },
    arbeidsstedNavn,
    periode,
    onSubmit,
    onCancel,
}) => {
    const intl = useIntl();

    const onValidSubmit = (value: FormValues) => {
        const gjentagelse: GjentagelseEnkeltdag | undefined =
            value.skalGjentas === true
                ? {
                      gjentagelsetype: value.gjentagelse,
                      tom: datepickerUtils.getDateFromDateString(value.stopDato),
                  }
                : undefined;
        onSubmit({
            dagMedTid: {
                dato,
                tid: value.skalIkkeJobbe === true ? { hours: '0', minutes: '0' } : value.tid,
            },
            gjelderFlereDager: gjentagelse,
        });
    };

    const erHistorisk = dayjs(dato).isBefore(dateToday);
    const dagNavn = dayjs(dato).format('dddd');
    const ukedager: DateRange = {
        from: dayjs(dato).startOf('week').toDate(),
        to: dayjs(dato).endOf('week').subtract(2, 'days').toDate(),
    };
    const mandag = dayjs(ukedager.from).format('D. MMM');
    const fredag = dayjs(ukedager.to).format('D. MMM');
    const ukeNavn = `${dayjs(dato).isoWeek()} (${mandag} til ${fredag})`;
    const månedNavn = dayjs(dato).format('MMMM YYYY');
    const datoString = dateFormatter.extended(dato);
    return (
        <div>
            <Undertittel tag="h1" className={bem.element('tittel')}>
                <span className="m-caps">{dagNavn}</span> {dateFormatter.full(dato)}
            </Undertittel>
            <FormBlock margin="l">
                <FormComponents.FormikWrapper
                    enableReinitialize={true}
                    initialValues={{
                        tid,
                    }}
                    onSubmit={onValidSubmit}
                    renderForm={({
                        getFieldHelpers,
                        values: { skalGjentas, stopGjentagelse, gjentagelse, skalIkkeJobbe },
                    }) => {
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'arbeidstidEnkeltdag')}
                                includeValidationSummary={false}
                                includeButtons={true}
                                submitButtonLabel="Lagre"
                                cancelButtonLabel="Avbryt">
                                <FormComponents.TimeInput
                                    disabled={skalIkkeJobbe === true}
                                    name={FormFields.tid}
                                    label={`Hvor mye ${
                                        erHistorisk ? 'jobbet du' : 'skal du jobbe'
                                    } hos ${arbeidsstedNavn} ${dateFormatter.fullWithDayName(dato)}?`}
                                    validate={getTimeValidator({ max: { hours: 24, minutes: 60 } })}
                                    timeInputLayout={{ justifyContent: 'left', compact: false, direction: 'vertical' }}
                                />
                                {includeSkalIkkeJobbe && (
                                    <FormBlock margin="m">
                                        <FormComponents.Checkbox
                                            label="Jeg skal ikke jobbe"
                                            afterOnChange={() => {
                                                const x = getFieldHelpers(FormFields.tid);
                                                if (skalIkkeJobbe) {
                                                    x.setValue({ hours: '0', minutes: '0' });
                                                } else {
                                                    x.setValue({ hours: '', minutes: '' });
                                                }
                                                x.setTouched(true);
                                            }}
                                            name={FormFields.skalIkkeJobbe}
                                        />
                                    </FormBlock>
                                )}
                                <FormBlock margin="m">
                                    <FormComponents.Checkbox
                                        label="Gjelder flere dager"
                                        name={FormFields.skalGjentas}
                                    />
                                </FormBlock>
                                {skalGjentas === true && (
                                    <div style={{ paddingLeft: '1.5rem' }}>
                                        <FormBlock margin="m">
                                            <FormComponents.RadioGroup
                                                className="compactRadios"
                                                radios={[
                                                    {
                                                        label: `Alle hverdager i uke ${ukeNavn}`,
                                                        value: GjentagelseType.heleUken,
                                                    },
                                                    {
                                                        label: `Alle hverdager i ${månedNavn}`,
                                                        value: GjentagelseType.heleMåneden,
                                                    },
                                                    {
                                                        label: `Hver ${dagNavn} fra og med ${datoString}`,
                                                        value: GjentagelseType.hverUke,
                                                    },
                                                    {
                                                        label: `Hver andre ${dagNavn} fra og med ${datoString}`,
                                                        value: GjentagelseType.hverAndreUke,
                                                    },
                                                ]}
                                                name={FormFields.gjentagelse}
                                            />
                                        </FormBlock>
                                        {(gjentagelse === GjentagelseType.hverUke ||
                                            gjentagelse === GjentagelseType.hverAndreUke) && (
                                            <>
                                                <FormBlock margin="m">
                                                    <FormComponents.Checkbox
                                                        label="Frem til ..."
                                                        name={FormFields.stopGjentagelse}
                                                    />
                                                </FormBlock>
                                                {stopGjentagelse && (
                                                    <FormBlock>
                                                        <FormComponents.DatePicker
                                                            label="Dato for stopp"
                                                            minDate={dato}
                                                            maxDate={periode.to}
                                                            disableWeekend={true}
                                                            fullScreenOnMobile={true}
                                                            useFastField={true}
                                                            dayPickerProps={{
                                                                initialMonth: dato,
                                                            }}
                                                            name={FormFields.stopDato}
                                                        />
                                                    </FormBlock>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </FormComponents.Form>
                        );
                    }}
                />
            </FormBlock>
        </div>
    );
};

export default ArbeidstidEnkeltdagForm;
