import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import TimefieldBase from '../../form-components/timefield-base/TimefieldBase';
import { showValidationErrors } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidationProps } from 'common/formik/FormikProps';

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
    ...otherInputProps
}) => {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount, setFieldValue } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
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
};

export default FormikTimefield;
