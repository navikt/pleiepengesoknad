import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getTypedFormComponents, InputTime } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDateValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import {
    ensureInputDuration,
    getMonthDateRange,
    getNumberOfDaysInDateRange,
    getWeekDateRange,
} from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import { InputDateString } from 'nav-datovelger/lib/types';
import { Undertittel } from 'nav-frontend-typografi';
import dateFormatter from '../../utils/common/dateFormatterUtils';
import { ArbeidsforholdType, DatoTidMap } from '../../types';
import { getArbeidstidEnkeltdagFormTidValidator } from '../../validation/validateArbeidFields';
import { getDagerMedNyArbeidstid } from './arbeidstidEnkeltdagUtils';

interface Props {
    dato: Date;
    tid?: Partial<InputTime>;
    arbeidsstedNavn: string;
    arbeidsforholdType: ArbeidsforholdType;
    periode: DateRange;
    onSubmit: (dagerMedTid: ArbeidstidEnkeltdagEndring) => void;
    onCancel: () => void;
}

export interface GjentagelseEnkeltdag {
    gjentagelsetype: GjentagelseType;
    tom?: Date;
}

export interface ArbeidstidEnkeltdagEndring {
    dagerMedTid: DatoTidMap;
}

enum FormFields {
    'tid' = 'tid',
    'skalGjentas' = 'skalGjentas',
    'gjentagelse' = 'gjentagelse',
    'stoppGjentagelse' = 'stoppGjentagelse',
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
    [FormFields.gjentagelse]: GjentagelseType;
    [FormFields.stoppGjentagelse]: boolean;
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
    arbeidsforholdType,
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
            dagerMedTid: getDagerMedNyArbeidstid(periode, dato, value.tid, gjentagelse),
        });
    };

    const erHistorisk = dayjs(dato).isBefore(dateToday);
    const dagNavn = dayjs(dato).format('dddd');
    const valgtDatoTxt = dateFormatter.dayFullShortDate(dato);

    const ukePeriode: DateRange = getDateRangeWithinDateRange(getWeekDateRange(dato, true), periode);
    const ukeErHel = dayjs(ukePeriode.from).isoWeekday() === 1 && dayjs(ukePeriode.to).isoWeekday() === 5;
    const månedPeriode: DateRange = getDateRangeWithinDateRange(getMonthDateRange(dato, true), periode);
    const månedErHel =
        dayjs(periode.from).isBefore(månedPeriode.from, 'month') && dayjs(periode.to).isAfter(månedPeriode.to, 'month');

    const ukePeriodeStartTxt = dateFormatter.dayFullShortDate(ukePeriode.from);
    const ukePeriodeSluttTxt = dateFormatter.dayFullShortDate(ukePeriode.to);

    const månedPeriodeStartTxt = dateFormatter.dayFullShortDate(månedPeriode.from);
    const månedPeriodeSluttTxt = dateFormatter.dayFullShortDate(månedPeriode.to);

    const ukeNavn = `${dayjs(dato).isoWeek()}`;
    const månedNavn = dayjs(dato).format('MMMM YYYY');

    const sluttDatoTxt = dateFormatter.dayFullShortDate(periode.to);

    const skalViseValgetGjelderFlereDager = getNumberOfDaysInDateRange(periode) > 2;

    const intlValues = {
        skalEllerHarJobbet: intlHelper(
            intl,
            erHistorisk ? 'arbeidstidEnkeltdagForm.jobbet' : 'arbeidstidEnkeltdagForm.skalJobbe'
        ),
        hvor: intlHelper(intl, `arbeidstidEnkeltdagForm.som.${arbeidsforholdType}`, { navn: arbeidsstedNavn }),
        når: dateFormatter.fullWithDayName(dato),
    };

    const renderGjentagelseRadioLabel = (
        key: string,
        periode?: { fra: string; til: string },
        values?: any
    ): JSX.Element => (
        <>
            <FormattedMessage id={`arbeidstidEnkeltdagForm.gjentagelse.${key}`} values={{ ...values, ...periode }} />
            <div className="m-comment">
                <FormattedMessage
                    id="arbeidstidEnkeltdagForm.gjentagelse.periode"
                    values={{
                        ...values,
                        ...periode,
                    }}
                />
            </div>
        </>
    );

    return (
        <div>
            <Undertittel tag="h1" className={bem.element('tittel')}>
                <span className="m-caps">{dagNavn}</span> {dateFormatter.full(dato)}
            </Undertittel>
            <FormBlock margin="l">
                <FormComponents.FormikWrapper
                    enableReinitialize={true}
                    initialValues={{
                        tid: tid ? ensureInputDuration(tid) : undefined,
                    }}
                    onSubmit={onValidSubmit}
                    renderForm={({ values: { skalGjentas, stoppGjentagelse, gjentagelse } }) => {
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(intl, 'arbeidstidEnkeltdagForm.validation')}
                                includeValidationSummary={false}
                                includeButtons={true}
                                submitButtonLabel="Lagre"
                                cancelButtonLabel="Avbryt">
                                <FormComponents.TimeInput
                                    name={FormFields.tid}
                                    label={intlHelper(intl, 'arbeidstidEnkeltdagForm.tid.spm', intlValues)}
                                    validate={getArbeidstidEnkeltdagFormTidValidator}
                                    timeInputLayout={{ justifyContent: 'left', compact: false, direction: 'vertical' }}
                                />
                                {skalViseValgetGjelderFlereDager && (
                                    <FormBlock margin="l">
                                        <FormComponents.Checkbox
                                            label={intlHelper(intl, 'arbeidstidEnkeltdagForm.gjelderFlereDager.label')}
                                            name={FormFields.skalGjentas}
                                        />
                                    </FormBlock>
                                )}
                                {skalGjentas === true && (
                                    <div style={{ paddingLeft: '1.5rem' }}>
                                        <FormBlock margin="m">
                                            <FormComponents.RadioGroup
                                                className="compactRadios"
                                                name={FormFields.gjentagelse}
                                                validate={getRequiredFieldValidator()}
                                                radios={[
                                                    {
                                                        label: renderGjentagelseRadioLabel(
                                                            ukeErHel ? 'helUke' : 'delAvUke',
                                                            {
                                                                fra: ukePeriodeStartTxt,
                                                                til: ukePeriodeSluttTxt,
                                                            },
                                                            { ukeNavn }
                                                        ),
                                                        value: GjentagelseType.heleUken,
                                                    },
                                                    {
                                                        label: renderGjentagelseRadioLabel(
                                                            månedErHel ? 'helMåned' : 'delAvMåned',
                                                            {
                                                                fra: månedPeriodeStartTxt,
                                                                til: månedPeriodeSluttTxt,
                                                            },
                                                            { månedNavn }
                                                        ),
                                                        value: GjentagelseType.heleMåneden,
                                                    },
                                                    {
                                                        label: renderGjentagelseRadioLabel(
                                                            'dagerFremover',
                                                            {
                                                                fra: valgtDatoTxt,
                                                                til: sluttDatoTxt,
                                                            },
                                                            { dagNavn }
                                                        ),

                                                        value: GjentagelseType.hverUke,
                                                    },
                                                ]}
                                            />
                                        </FormBlock>
                                        {(gjentagelse === GjentagelseType.hverUke ||
                                            gjentagelse === GjentagelseType.hverAndreUke) && (
                                            <>
                                                <div style={{ marginLeft: '1.5rem' }}>
                                                    <FormBlock margin="m">
                                                        <FormComponents.Checkbox
                                                            label={intlHelper(
                                                                intl,
                                                                'arbeidstidEnkeltdagForm.stoppGjentagelse.label'
                                                            )}
                                                            name={FormFields.stoppGjentagelse}
                                                        />
                                                    </FormBlock>
                                                    {stoppGjentagelse && (
                                                        <FormBlock margin="l">
                                                            <FormComponents.DatePicker
                                                                label={intlHelper(
                                                                    intl,
                                                                    'arbeidstidEnkeltdagForm.stopDato.label'
                                                                )}
                                                                minDate={dato}
                                                                maxDate={periode.to}
                                                                validate={getDateValidator({
                                                                    min: dato,
                                                                    max: periode.to,
                                                                    required: true,
                                                                })}
                                                                disableWeekend={true}
                                                                fullScreenOnMobile={true}
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
