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

import './utenlandsoppholdForm.less';

interface FormLabels {
    title: string;
    fromDate: string;
    toDate: string;
    country: string;
    okButton: string;
    cancelButton: string;
}

interface Props {
    minDate: Date;
    maxDate: Date;
    values?: Utenlandsopphold;
    labels?: FormLabels;
    onSubmit: (values: Utenlandsopphold) => void;
    onCancel: () => void;
}

export enum UtenlandsoppholdFields {
    fromDate = 'fromDate',
    toDate = 'toDate',
    countryCode = 'countryCode'
}

const defaultLabels: FormLabels = {
    title: 'Utenlandsopphold',
    fromDate: 'Fra og med',
    toDate: 'Til og med',
    country: 'Hvilket land',
    okButton: 'Ok',
    cancelButton: 'Avbryt'
};

const bem = bemUtils('utenlandsoppholdForm');

const defaultFormValues: Partial<Utenlandsopphold> = {};

const UtenlandsoppholdForm: React.FunctionComponent<Props & InjectedIntlProps> = ({
    intl,
    maxDate,
    minDate,
    labels = defaultLabels,
    values: initialValues = defaultFormValues,
    onSubmit,
    onCancel
}) => {
    const [showErrors, setShowErrors] = useState(false);

    const onFormikSubmit = (formValues: Utenlandsopphold) => {
        onSubmit(formValues);
    };

    return (
        <Formik initialValues={initialValues} onSubmit={onFormikSubmit} validateOnChange={true} validateOnMount={true}>
            {({ handleSubmit, values, isValid, errors }) => (
                <form onSubmit={handleSubmit} className={bem.block}>
                    <div>
                        <Box padBottom="l">
                            <Systemtittel tag="h1">{labels.title}</Systemtittel>
                        </Box>
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
                                                label={labels.fromDate}
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
                                                label={labels.toDate}
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

                        <Box padBottom="m">
                            <Field name={UtenlandsoppholdFields.countryCode} validate={validation.validateCountry}>
                                {({ field, form: { setFieldValue } }: FieldProps) => {
                                    const errorMsgProps = showErrors
                                        ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                                        : null;
                                    return (
                                        <CountrySelect
                                            name={field.name}
                                            label={labels.country}
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
                                {labels.okButton}
                            </Knapp>
                            <Knapp type="flat" htmlType="button" onClick={() => onCancel()}>
                                {labels.cancelButton}
                            </Knapp>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default injectIntl(UtenlandsoppholdForm);
