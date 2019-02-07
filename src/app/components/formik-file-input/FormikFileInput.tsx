import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendUtils';
import FileInputBase from '../file-input-base/FileInputBase';

export interface FormikFileInputProps<T> {
    name: T;
    label: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
    onFilesSelect: (files: File[]) => void;
}

const FormikFileInput = <T extends {}>(): React.FunctionComponent<FormikFileInputProps<T>> => ({
    label,
    name,
    validate,
    onFilesSelect
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return <FileInputBase id={field.name} label={label} onFilesSelect={onFilesSelect} {...errorMsgProps} />;
        }}
    </FormikField>
);

export default FormikFileInput;
