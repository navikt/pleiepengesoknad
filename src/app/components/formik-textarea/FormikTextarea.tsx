import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import { FormikValidationProps } from 'app/types/FormikProps';
import TextareaBase from '../textarea-base/TextareaBase';
import { TextareaProps } from 'nav-frontend-skjema';

interface FormikTextareaProps<T> {
    name: T;
    helperText?: string;
    maxLength?: number;
}

export type SelectedTextareaProps = Partial<TextareaProps>;

type Props = SelectedTextareaProps & FormikValidationProps;

const FormikTextarea = <T extends {}>(): React.FunctionComponent<Props & FormikTextareaProps<T>> => ({
    label,
    name,
    validate,
    intl,
    ...otherTextareaProps
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
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

export default FormikTextarea;
