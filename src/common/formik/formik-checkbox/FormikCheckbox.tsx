import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { Checkbox, CheckboxProps } from 'nav-frontend-skjema';
import { showValidationErrors } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidationProps, FormikValidateFunction } from 'common/formik/FormikProps';

interface FormikCheckboxProps<T> {
    validate?: FormikValidateFunction;
    afterOnChange?: (newValue: boolean) => void;
    name: T;
}

type Props<T> = CheckboxProps & FormikCheckboxProps<T> & FormikValidationProps;

function FormikCheckbox<T>({ name, label, validate, afterOnChange, ...otherInputProps }: Props<T>) {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, setFieldValue, status, submitCount } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <Checkbox
                        label={label}
                        name={name}
                        {...otherInputProps}
                        {...errorMsgProps}
                        {...field}
                        checked={field.value === true}
                        onChange={() => {
                            const newValue = !field.value;
                            setFieldValue(field.name, newValue);
                            if (afterOnChange) {
                                afterOnChange(newValue);
                            }
                        }}
                    />
                );
            }}
        </FormikField>
    );
}

export default FormikCheckbox;
