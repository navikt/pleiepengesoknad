import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendUtils';
import InputBase from '../input-base/InputBase';
import { NavFrontendInputProps } from 'nav-frontend-skjema';

interface FormikInputProps<T> {
    name: T;
    validate?: ((value: any) => string | Promise<void> | undefined);
}

const FormikInput = <T extends {}>(): React.FunctionComponent<NavFrontendInputProps & FormikInputProps<T>> => ({
    label,
    name,
    validate,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return <InputBase label={label} {...otherInputProps} {...errorMsgProps} {...field} />;
        }}
    </FormikField>
);

export default FormikInput;
