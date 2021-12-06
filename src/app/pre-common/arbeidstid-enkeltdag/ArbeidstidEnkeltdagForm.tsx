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
import dateFormatter from '../../utils/dateFormatterUtils';
import { ensureTime } from '../../utils/timeUtils';
import { getMonthDateRange, getNumberOfDaysInDateRange, getWeekDateRange } from '../../utils/dateUtils';

interface Props {
    dato: Date;
    tid?: Partial<InputTime>;
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
    dato: Date;
    tid: InputTime;
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

const getDateRangeWithinDateRange = (range: DateRange, limitRange: DateRange): DateRange => {
    return {
        from: dayjs.max(dayjs(range.from), dayjs(limitRange.from)).toDate(),
        to: dayjs.min(dayjs(range.to), dayjs(limitRange.to)).toDate(),
    };
};

const ArbeidstidEnkeltdagForm: React.FunctionComponent<Props> = ({
    dato,
    tid,
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
            dato,
            tid: value.skalIkkeJobbe === true ? { hours: '0', minutes: '0' } : value.tid,
            gjelderFlereDager: gjentagelse,
        });
    };

    const erHistorisk = dayjs(dato).isBefore(dateToday);
    const dagNavn = dayjs(dato).format('dddd');
    const datoString = dateFormatter.extended(dato);

    const ukePeriode: DateRange = getDateRangeWithinDateRange(getWeekDateRange(dato, true), periode);
    const månedPeriode: DateRange = getDateRangeWithinDateRange(getMonthDateRange(dato, true), periode);

    const ukePeriodeStartTxt = dateFormatter.dayDateAndMonthShort(ukePeriode.from);
    const ukePeriodeSluttTxt = dateFormatter.dayDateAndMonthShort(ukePeriode.to);

    const månedPeriodeStartTxt = dateFormatter.dayDateAndMonthShort(månedPeriode.from);
    const månedPeriodeSluttTxt = dateFormatter.dayDateAndMonthShort(månedPeriode.to);

    const ukeNavn = `${dayjs(dato).isoWeek()}`;
    const månedNavn = dayjs(dato).format('MMMM YYYY');

    const sluttDatoTxt = dateFormatter.extended(periode.to);

    return (
        <div>
            <Undertittel tag="h1" className={bem.element('tittel')}>
                <span className="m-caps">{dagNavn}</span> {dateFormatter.full(dato)}
            </Undertittel>
            <FormBlock margin="l">
                <FormComponents.FormikWrapper
                    enableReinitialize={true}
                    initialValues={{
                        tid: tid ? ensureTime(tid) : undefined,
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
                                {getNumberOfDaysInDateRange(periode) > 2 && (
                                    <FormBlock margin="m">
                                        <FormComponents.Checkbox
                                            label="Gjelder flere dager"
                                            name={FormFields.skalGjentas}
                                        />
                                    </FormBlock>
                                )}
                                {skalGjentas === true && (
                                    <div style={{ paddingLeft: '1.5rem' }}>
                                        <FormBlock margin="m">
                                            <FormComponents.RadioGroup
                                                className="compactRadios"
                                                radios={[
                                                    {
                                                        label: `Hverdager i uke ${ukeNavn} (${ukePeriodeStartTxt} - ${ukePeriodeSluttTxt})`,
                                                        value: GjentagelseType.heleUken,
                                                    },
                                                    {
                                                        label: (
                                                            <>
                                                                Hverdager i {månedNavn} ({månedPeriodeStartTxt} -{' '}
                                                                {månedPeriodeSluttTxt})
                                                            </>
                                                        ),
                                                        value: GjentagelseType.heleMåneden,
                                                    },
                                                    {
                                                        label: `Hver ${dagNavn} fra og med ${datoString} til og med ${sluttDatoTxt}`,
                                                        value: GjentagelseType.hverUke,
                                                    },
                                                ]}
                                                name={FormFields.gjentagelse}
                                            />
                                        </FormBlock>
                                        {(gjentagelse === GjentagelseType.hverUke ||
                                            gjentagelse === GjentagelseType.hverAndreUke) && (
                                            <>
                                                <div style={{ marginLeft: '1.5rem' }}>
                                                    <FormBlock margin="m">
                                                        <FormComponents.Checkbox
                                                            label="Velg en annen til og med dato"
                                                            name={FormFields.stopGjentagelse}
                                                        />
                                                    </FormBlock>
                                                    {stopGjentagelse && (
                                                        <FormBlock margin="l">
                                                            <FormComponents.DatePicker
                                                                label="Velg til og med dato"
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
                                                </div>
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
