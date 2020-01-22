import React, { useState } from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';
import CountrySelect from 'common/components/country-select/CountrySelect';
import bemUtils from 'common/utils/bemUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import validation from './utenlandsoppholdFormValidation';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { isMemberOfEEC } from 'common/utils/eecUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import TextareaBase from 'common/form-components/textarea-base/TextareaBase';

import './utenlandsoppholdForm.less';
import { hasValue } from 'common/validation/hasValue';
import FormikDateIntervalPicker from 'common/formik/formik-date-interval-picker/FormikDateIntervalPicker';

export interface UtenlandsoppholdFormLabels {
    title: string;
    intervalTitle: string;
    fromDate: string;
    toDate: string;
    country: string;
    eøsInfo?: string;
    reasonLabel?: string;
    reasonHelperText?: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    opphold?: Utenlandsopphold;
    labels?: Partial<UtenlandsoppholdFormLabels>;
    reasonNeeded?: boolean;
    onSubmit: (values: Utenlandsopphold) => void;
    onCancel: () => void;
}

export enum UtenlandsoppholdFormFields {
    fromDate = 'fromDate',
    toDate = 'toDate',
    countryCode = 'countryCode',
    reason = 'reason',
    outsideEØS = 'outsideEØS'
}

const defaultLabels: UtenlandsoppholdFormLabels = {
    title: 'Utenlandsopphold',
    intervalTitle: 'Velg tidsrom',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    country: 'Hvilket land',
    reasonLabel: 'Hva er årsaken til denne reisen?',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

const bem = bemUtils('utenlandsoppholdForm');

const defaultFormValues: Partial<Utenlandsopphold> = {
    fromDate: undefined,
    toDate: undefined,
    countryCode: undefined,
    reason: undefined
};

const UtenlandsoppholdForm: React.FunctionComponent<Props> = ({
    maxDate,
    minDate,
    reasonNeeded,
    labels,
    opphold: initialValues = defaultFormValues,
    onSubmit,
    onCancel
}) => {
    const intl = useIntl();
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (formValues: Utenlandsopphold) => {
        const reason = isMemberOfEEC(formValues.countryCode) ? undefined : formValues.reason;
        onSubmit({ ...formValues, reason });
    };

    const formLabels: UtenlandsoppholdFormLabels = { ...defaultLabels, ...labels };

    return (
        <Formik initialValues={initialValues} onSubmit={onFormikSubmit} validateOnChange={true} validateOnMount={true}>
            {({ handleSubmit, values, isValid, errors, ...rest }) => {
                const showReasonField =
                    reasonNeeded &&
                    values.countryCode !== undefined &&
                    hasValue(values.countryCode) &&
                    !isMemberOfEEC(values.countryCode);
                return (
                    <form onSubmit={handleSubmit} className={bem.block}>
                        <div>
                            <Box padBottom="l">
                                <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                            </Box>

                            <Box padBottom="l">
                                <FormikDateIntervalPicker<UtenlandsoppholdFormFields>
                                    legend={formLabels.intervalTitle}
                                    validationErrorsVisible={showErrors}
                                    fromDatepickerProps={{
                                        name: UtenlandsoppholdFormFields.fromDate,
                                        label: formLabels.fromDate,
                                        dateLimitations: {
                                            minDato: minDate,
                                            maksDato: values.toDate || maxDate
                                        },
                                        validate: (date: Date) =>
                                            validation.validateFromDate(date, minDate, maxDate, values.toDate)
                                    }}
                                    toDatepickerProps={{
                                        name: UtenlandsoppholdFormFields.toDate,
                                        label: formLabels.toDate,
                                        dateLimitations: {
                                            minDato: values.fromDate || minDate,
                                            maksDato: maxDate
                                        },
                                        validate: (date: Date) =>
                                            validation.validateToDate(date, minDate, maxDate, values.fromDate)
                                    }}
                                />
                            </Box>

                            <Box padBottom="l">
                                <Field
                                    name={UtenlandsoppholdFormFields.countryCode}
                                    validate={validation.validateCountry}>
                                    {({ field, form: { setFieldValue, setFieldTouched } }: FieldProps) => {
                                        const errorMsgProps = showErrors
                                            ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                            : null;
                                        return (
                                            <CountrySelect
                                                name={field.name}
                                                label={formLabels.country}
                                                defaultValue={field.value}
                                                onChange={(country) => {
                                                    setFieldValue(UtenlandsoppholdFormFields.countryCode, country);
                                                    setTimeout(() => {
                                                        // Needs to delay for formik to register
                                                        // validation on the reason field. Bug I could
                                                        // not find out if was ours or Formiks (Frode)
                                                        setFieldTouched(UtenlandsoppholdFormFields.reason);
                                                    }, 50);
                                                }}
                                                {...errorMsgProps}
                                            />
                                        );
                                    }}
                                </Field>
                            </Box>
                            {showReasonField && (
                                <Box padBottom="m">
                                    {formLabels.eøsInfo && (
                                        <Box padBottom="l">
                                            <AlertStripe type="info">{formLabels.eøsInfo}</AlertStripe>
                                        </Box>
                                    )}
                                    <Field
                                        name={UtenlandsoppholdFormFields.reason}
                                        validateOnMount={true}
                                        validate={validation.validateReason}>
                                        {({ field, form: { setFieldValue } }: FieldProps) => {
                                            const errorMsgProps = showErrors
                                                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                                : null;
                                            return (
                                                <TextareaBase
                                                    helperText={formLabels.reasonHelperText}
                                                    name={field.name}
                                                    label={formLabels.reasonLabel}
                                                    value={field.value || ''}
                                                    onChange={(evt) => {
                                                        setFieldValue(field.name, evt.target.value);
                                                    }}
                                                    maxLength={250}
                                                    {...errorMsgProps}
                                                />
                                            );
                                        }}
                                    </Field>
                                </Box>
                            )}
                            <div className={bem.element('knapper')}>
                                <Knapp
                                    type="hoved"
                                    htmlType="button"
                                    onClick={() => {
                                        setShowErrors(true);
                                        if (isValid) {
                                            onFormikSubmit(values as Utenlandsopphold);
                                        }
                                    }}>
                                    {formLabels.okButton}
                                </Knapp>
                                <Knapp type="flat" htmlType="button" onClick={() => onCancel()}>
                                    {formLabels.cancelButton}
                                </Knapp>
                            </div>
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default UtenlandsoppholdForm;
