import * as React from 'react';
import { Field, FieldProps as FormikFieldProps } from 'formik';
import DatepickerBase, { DateLimitiations } from 'common/form-components/datepicker-base/DatepickerBase';
import { FormikValidateFunction, FormikValidationProps } from 'common/formik/FormikProps';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';

export interface FormikDatepickerProps<T> {
    name: T;
    label: string;
    validate?: FormikValidateFunction;
    dateLimitations?: DateLimitiations;
}

type Props<T> = FormikDatepickerProps<T> & FormikValidationProps;

function FormikDatepicker<T>({
    validate,
    label,
    dateLimitations,
    name,
    showValidationErrors,
    ...otherProps
}: Props<T>) {
    const intl = useIntl();
    return (
        <Field validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount, setFieldValue } }: FormikFieldProps) => {
                const errorMsgProps =
                    showValidationErrors || isValidationErrorsVisible(status, submitCount)
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
        </Field>
    );
}

export default FormikDatepicker;
