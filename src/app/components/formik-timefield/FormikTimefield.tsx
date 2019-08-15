import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import TimefieldBase, { TimefieldValue } from '../timefield-base/TimefieldBase';

interface FormikTimefieldProps<T> {
    name: T;
    label: React.ReactNode;
    value: TimefieldValue;
    helperText?: string;
    maxLength?: number;
}

const FormikTimefield = <T extends {}>(): React.FunctionComponent<FormikTimefieldProps<T> & FormikValidationProps> => ({
    label,
    name,
    validate,
    intl,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <TimefieldBase label={label} {...otherInputProps} {...errorMsgProps} {...field} value={field.value} />
            );
        }}
    </FormikField>
);

export default FormikTimefield;
