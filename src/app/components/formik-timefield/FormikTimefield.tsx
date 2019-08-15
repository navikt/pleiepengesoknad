import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import TimefieldBase from '../timefield-base/TimefieldBase';

interface FormikTimefieldProps<T> {
    name: T;
    label: React.ReactNode;
    helperText?: string;
    disabled?: boolean;
}

const FormikTimefield = <T extends {}>(): React.FunctionComponent<FormikTimefieldProps<T> & FormikValidationProps> => ({
    label,
    name,
    validate,
    intl,
    ...otherInputProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
            return (
                <TimefieldBase
                    label={label}
                    {...otherInputProps}
                    {...errorMsgProps}
                    {...field}
                    value={field.value}
                    onChange={(value) => setFieldValue(field.name, value)}
                />
            );
        }}
    </FormikField>
);

export default FormikTimefield;
