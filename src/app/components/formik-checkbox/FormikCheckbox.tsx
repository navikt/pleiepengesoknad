import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendUtils';
import { Checkbox, CheckboxProps } from 'nav-frontend-skjema';

interface FormikCheckboxProps<T> {
    validate?: ((value: any) => string | Promise<void> | undefined);
    afterOnChange?: (newValue: boolean) => void;
    name: T;
}

const FormikCheckbox = <T extends {}>(): React.FunctionComponent<CheckboxProps & FormikCheckboxProps<T>> => ({
    name,
    label,
    validate,
    afterOnChange,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, setFieldValue, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <Checkbox
                    label={label}
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

export default FormikCheckbox;
