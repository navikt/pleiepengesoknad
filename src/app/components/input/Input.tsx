import * as React from 'react';
import { Input as NAVInput } from 'nav-frontend-skjema';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';

interface InputProps {
    label: string;
    name: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
}

const Input = ({ name, label, validate }: InputProps) => (
    <FormikField validate={validate} name={name}>
        {({ field, form }: FormikFieldProps) => (
            <NAVInput label={label} {...field} {...getValidationErrorProps(form.errors, field.name)} />
        )}
    </FormikField>
);

export default Input;
