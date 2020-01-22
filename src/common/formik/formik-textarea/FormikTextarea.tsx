import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import TextareaBase from 'common/form-components/textarea-base/TextareaBase';
import { TextareaProps } from 'nav-frontend-skjema';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidationProps } from 'common/formik/FormikProps';

interface FormikTextareaProps<T> {
    name: T;
    helperText?: string;
    maxLength?: number;
}

export type SelectedTextareaProps = Partial<TextareaProps>;

type Props<T> = FormikTextareaProps<T> & SelectedTextareaProps & FormikValidationProps;

function FormikTextarea<T>({ label, name, validate, showValidationErrors, ...otherTextareaProps }: Props<T>) {
    const intl = useIntl();
    return (
        <FormikField validate={validate} name={name}>
            {({ field, form: { errors, status, submitCount } }: FormikFieldProps) => {
                const errorMsgProps =
                    showValidationErrors || isValidationErrorsVisible(status, submitCount)
                        ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                        : {};

                return (
                    <TextareaBase
                        label={label}
                        {...otherTextareaProps}
                        {...errorMsgProps}
                        {...field}
                        value={field.value || ''}
                    />
                );
            }}
        </FormikField>
    );
}

export default FormikTextarea;
