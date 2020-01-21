import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import DatepickerBase, { DateLimitiations } from 'common/form-components/datepicker-base/DatepickerBase';
import { FormikValidateFunction, FormikValidationProps } from 'common/formik/FormikProps';
import { showValidationErrors } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';

export interface FormikDatepickerProps<T> {
    name: T;
    label: string;
    validate?: FormikValidateFunction;
    dateLimitations?: DateLimitiations;
}

type Props<T> = FormikDatepickerProps<T> & FormikValidationProps;

function FormikDatepicker<FormField>({ validate, label, dateLimitations, name, ...otherProps }: Props<FormField>) {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount, setFieldValue } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <DatepickerBase
                        id={`${name}`}
                        label={label}
                        value={field.value}
                        dateLimitations={dateLimitations}
                        {...otherProps}
                        {...errorMsgProps}
                        {...field}
                        onChange={(date: Date) => {
                            setFieldValue(field.name, date);
                        }}
                    />
                );
            }}
        </FormikField>
    );
}

export default FormikDatepicker;
