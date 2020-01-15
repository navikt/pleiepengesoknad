import React, { useState } from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import DatepickerBase from 'common/form-components/datepicker-base/DatepickerBase';
import CountrySelect from 'common/components/country-select/CountrySelect';
import bemUtils from 'common/utils/bemUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import Box from 'common/components/box/Box';
import validation from './utenlandsoppholdFormValidation';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { isMemberOfEØS } from 'common/utils/eøsUtils';
import AlertStripe from 'nav-frontend-alertstriper';
import TextareaBase from 'common/form-components/textarea-base/TextareaBase';
import { hasValue } from 'app/validation/fieldValidations';

import './utenlandsoppholdForm.less';

export interface UtenlandsoppholdFormLabels {
    title: string;
    fromDate: string;
    toDate: string;
    country: string;
    eøsInfo?: string;
    eøsReason?: string;
    reasonHelperText?: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    values?: Utenlandsopphold;
    labels?: Partial<UtenlandsoppholdFormLabels>;
    includeEøsQuestion?: boolean;
    onSubmit: (values: Utenlandsopphold) => void;
    onCancel: () => void;
}

export enum UtenlandsoppholdFields {
    fromDate = 'fromDate',
    toDate = 'toDate',
    countryCode = 'countryCode',
    reason = 'reason'
}

const defaultLabels: UtenlandsoppholdFormLabels = {
    title: 'Utenlandsopphold',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    country: 'Hvilket land',
    eøsReason: 'Hva er årsaken til denne reisen?',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

const bem = bemUtils('utenlandsoppholdForm');

const defaultFormValues: Partial<Utenlandsopphold> = {};

const UtenlandsoppholdForm: React.FunctionComponent<Props & InjectedIntlProps> = ({
    intl,
    maxDate,
    minDate,
    includeEøsQuestion,
    labels,
    values: initialValues = defaultFormValues,
    onSubmit,
    onCancel
}) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (formValues: Utenlandsopphold) => {
        onSubmit(formValues);
    };

    const formLabels: UtenlandsoppholdFormLabels = { ...defaultLabels, ...labels };

    return (
        <Formik initialValues={initialValues} onSubmit={onFormikSubmit} validateOnChange={true} validateOnMount={true}>
            {({ handleSubmit, values, isValid, errors }) => (
                <form onSubmit={handleSubmit} className={bem.block}>
                    <div>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">{formLabels.title}</Systemtittel>
                        </Box>

                        <Box padBottom="l">
                            <div className={bem.element('datoer')}>
                                <div className={bem.element('dato')}>
                                    <Field
                                        name={UtenlandsoppholdFields.fromDate}
                                        validate={(date: Date) =>
                                            validation.validateFromDate(date, minDate, maxDate, values.toDate)
                                        }>
                                        {({ field, form: { setFieldValue } }: FieldProps) => {
                                            const errorMsgProps = showErrors
                                                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                                : null;

                                            return (
                                                <DatepickerBase
                                                    id="utenlandsoppholdStart"
                                                    value={field.value}
                                                    name={field.name}
                                                    label={formLabels.fromDate}
                                                    onChange={(date) => {
                                                        setFieldValue(field.name, date);
                                                    }}
                                                    {...errorMsgProps}
                                                    dateLimitations={{
                                                        minDato: minDate,
                                                        maksDato: values.toDate || maxDate
                                                    }}
                                                />
                                            );
                                        }}
                                    </Field>
                                </div>
                                <div className={bem.element('dato')}>
                                    <Field
                                        name={UtenlandsoppholdFields.toDate}
                                        validate={(date: Date) =>
                                            validation.validateToDate(date, minDate, maxDate, values.fromDate)
                                        }>
                                        {({ field, form: { setFieldValue } }: FieldProps) => {
                                            const errorMsgProps = showErrors
                                                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                                : null;
                                            return (
                                                <DatepickerBase
                                                    id="utenlandsoppholdStop"
                                                    value={field.value}
                                                    name={field.name}
                                                    label={formLabels.toDate}
                                                    onChange={(date) => setFieldValue(field.name, date)}
                                                    {...errorMsgProps}
                                                    dateLimitations={{
                                                        minDato: values.fromDate || minDate,
                                                        maksDato: maxDate
                                                    }}
                                                />
                                            );
                                        }}
                                    </Field>
                                </div>
                            </div>
                        </Box>
                        <Box padBottom="l">
                            <Field name={UtenlandsoppholdFields.countryCode} validate={validation.validateCountry}>
                                {({ field, form: { setFieldValue } }: FieldProps) => {
                                    const errorMsgProps = showErrors
                                        ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                        : null;
                                    return (
                                        <CountrySelect
                                            name={field.name}
                                            label={formLabels.country}
                                            defaultValue={field.value}
                                            onChange={(country) =>
                                                setFieldValue(UtenlandsoppholdFields.countryCode, country)
                                            }
                                            {...errorMsgProps}
                                        />
                                    );
                                }}
                            </Field>
                        </Box>
                        {includeEøsQuestion &&
                            hasValue(values.countryCode) &&
                            isMemberOfEØS(values.countryCode || '') === false && (
                                <Box padBottom="m">
                                    {formLabels.eøsInfo && (
                                        <Box padBottom="l">
                                            <AlertStripe type="info">{formLabels.eøsInfo}</AlertStripe>
                                        </Box>
                                    )}
                                    <Field name={UtenlandsoppholdFields.reason} validate={validation.validateReason}>
                                        {({ field, form: { setFieldValue } }: FieldProps) => {
                                            const errorMsgProps = showErrors
                                                ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                                : null;
                                            return (
                                                <TextareaBase
                                                    helperText={formLabels.reasonHelperText}
                                                    name={field.name}
                                                    label={formLabels.eøsReason}
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
            )}
        </Formik>
    );
};

export default injectIntl(UtenlandsoppholdForm);
