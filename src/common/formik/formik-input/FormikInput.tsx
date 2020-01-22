import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import InputBase, { InputBaseProps } from 'common/form-components/input-base/InputBase';
import { NavFrontendInputProps } from 'nav-frontend-skjema';
import { showValidationErrors } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidationProps } from 'common/formik/FormikProps';

interface FormikInputProps<T> extends InputBaseProps {
    name: T;
}

type Props<T> = FormikInputProps<T> & NavFrontendInputProps & FormikValidationProps;

function FormikInput<T>({ label, name, validate, ...otherInputProps }: Props<T>) {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount } }: FormikFieldProps) => {
                const errorMsgProps = showValidationErrors(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <InputBase
                        label={label}
                        {...otherInputProps}
                        {...errorMsgProps}
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                    />
                );
            }}
        </FormikField>
    );
}

export default FormikInput;
