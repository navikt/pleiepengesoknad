import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import { Checkbox, CheckboxProps } from 'nav-frontend-skjema';

interface FormikCheckboxProps {
    validate?: ((value: any) => string | Promise<void> | undefined);
    afterOnChange?: (newValue: boolean) => void;
}

type Props = FormikCheckboxProps & CheckboxProps;

const FormikCheckbox = ({ name, label, validate, afterOnChange, ...otherInputProps }: Props) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, setFieldValue, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <Checkbox
                    label={label}
                    {...otherInputProps}
                    {...errorMsgProps}
                    {...field}
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

export default FormikCheckbox;
