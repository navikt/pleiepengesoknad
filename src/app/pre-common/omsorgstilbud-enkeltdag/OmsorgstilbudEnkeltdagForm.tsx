import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, getTypedFormComponents, InputTime } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getIntlFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import dayjs from 'dayjs';
import { Undertittel } from 'nav-frontend-typografi';
import { DatoTidMap } from '../../types';
import { ensureTime } from '../../utils/common/inputTimeUtils';
import dateFormatter from '../../utils/common/dateFormatterUtils';
import { InputDateString } from 'nav-datovelger/lib/types';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getMonthDateRange, getNumberOfDaysInDateRange, getWeekDateRange } from '../../utils/common/dateRangeUtils';
import { getDateValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getDagerMedNyOmsorgstilbud } from './OmsorgstilbudEnkeltdagUtils';

interface Props {
    dato: Date;
    tid?: Partial<InputTime>;
    periode: DateRange;
    onSubmit: (dagerMedTid: OmsorgstilbudEnkeltdagEndring) => void;
    onCancel: () => void;
}

export enum GjentagelseType {
    hverUke = 'hverUke',
    hverAndreUke = 'hverAndreUke',
    heleUken = 'heleUken',
    heleMåneden = 'heleMåneden',
}

export interface GjentagelseEnkeltdag {
    gjentagelsetype: GjentagelseType;
    tom?: Date;
}

export interface OmsorgstilbudEnkeltdagEndring {
    dagerMedTid: DatoTidMap;
}

enum FormFields {
    'tid' = 'tid',
    'skalGjentas' = 'skalGjentas',
    'gjentagelse' = 'gjentagelse',
    'stoppGjentagelse' = 'stoppGjentagelse',
    'stopDato' = 'stopDato',
}

interface FormValues {
    [FormFields.tid]: InputTime;
    [FormFields.skalGjentas]: boolean;
    [FormFields.gjentagelse]: GjentagelseType;
    [FormFields.stoppGjentagelse]: boolean;
    [FormFields.stopDato]: InputDateString;
}

const FormComponents = getTypedFormComponents<FormFields, FormValues, ValidationError>();

const bem = bemUtils('omsorgstilbudEnkeltdagEdit');

const getDateRangeWithinDateRange = (range: DateRange, limitRange: DateRange): DateRange => {
    return {
        from: dayjs.max(dayjs(range.from), dayjs(limitRange.from)).toDate(),
        to: dayjs.min(dayjs(range.to), dayjs(limitRange.to)).toDate(),
    };
};

const OmsorgstilbudEnkeltdagForm: React.FC<Props> = ({ dato, tid, periode, onSubmit, onCancel }) => {
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
            dagerMedTid: getDagerMedNyOmsorgstilbud(periode, dato, value.tid, gjentagelse),
        });
    };
    const erHistorisk = dayjs(dato).isBefore(dateToday, 'day');
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

    const renderGjentagelseRadioLabel = (
        key: string,
        periode?: { fra: string; til: string },
        values?: any
    ): JSX.Element => (
        <>
            <FormattedMessage id={`omsorgstilbudEnkeltdagForm.gjentagelse.${key}`} values={{ ...values, ...periode }} />
            <div className="m-comment">
                <FormattedMessage
                    id="omsorgstilbudEnkeltdagForm.gjentagelse.periode"
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
                Tid i omsorgstilbud {dateFormatter.full(dato)}
            </Undertittel>
            <FormBlock margin="l">
                <FormComponents.FormikWrapper
                    initialValues={{
                        tid: tid ? ensureTime(tid) : undefined,
                    }}
                    onSubmit={onValidSubmit}
                    renderForm={({ values: { skalGjentas, stoppGjentagelse, gjentagelse } }) => {
                        return (
                            <FormComponents.Form
                                onCancel={onCancel}
                                formErrorHandler={getIntlFormErrorHandler(
                                    intl,
                                    'omsorgstilbudEnkeltdagForm.validation'
                                )}
                                includeValidationSummary={false}
                                includeButtons={true}
                                submitButtonLabel="Lagre"
                                cancelButtonLabel="Avbryt">
                                <FormComponents.TimeInput
                                    name={FormFields.tid}
                                    label={`Hvor mye ${
                                        erHistorisk ? 'var barnet' : 'skal barnet være'
                                    } i omsorgstilbud ${dateFormatter.extended(dato)}?`}
                                    validate={getTimeValidator({ max: { hours: 7, minutes: 30 } })}
                                    timeInputLayout={{ justifyContent: 'left', compact: false, direction: 'vertical' }}
                                />
                                {skalViseValgetGjelderFlereDager && (
                                    <FormBlock margin="l">
                                        <FormComponents.Checkbox
                                            label={intlHelper(
                                                intl,
                                                'omsorgstilbudEnkeltdagForm.gjelderFlereDager.label'
                                            )}
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
                                                                'omsorgstilbudEnkeltdagForm.stoppGjentagelse.label'
                                                            )}
                                                            name={FormFields.stoppGjentagelse}
                                                        />
                                                    </FormBlock>
                                                    {stoppGjentagelse && (
                                                        <FormBlock margin="l">
                                                            <FormComponents.DatePicker
                                                                label={intlHelper(
                                                                    intl,
                                                                    'omsorgstilbudEnkeltdagForm.stopDato.label'
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

export default OmsorgstilbudEnkeltdagForm;
