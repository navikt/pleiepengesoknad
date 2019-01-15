import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import Input from '../input/Input';
import { NavFrontendInputProps } from 'nav-frontend-skjema';

interface FormikInputProps {
    validate?: ((value: any) => string | Promise<void> | undefined);
}

type Props = FormikInputProps & NavFrontendInputProps;

const FormikInput = ({ name, label, validate, ...otherInputProps }: Props) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            // optional onChange-prop will be overriden by formik
            return <Input label={label} {...otherInputProps} {...errorMsgProps} {...field} />;
        }}
    </FormikField>
);

export default FormikInput;
