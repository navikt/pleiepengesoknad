import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import Input from '../input/Input';

interface InputProps {
    label: string;
    name: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
}

const FormikInput = ({ name, label, validate }: InputProps) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return <Input label={label} {...field} {...errorMsgProps} />;
        }}
    </FormikField>
);

export default FormikInput;
