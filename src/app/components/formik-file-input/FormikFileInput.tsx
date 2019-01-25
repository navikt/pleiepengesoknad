import * as React from 'react';
import { Field as FormikField, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorProps } from '../../utils/navFrontendHelper';
import FileInputBase from '../file-input-base/FileInputBase';

interface FormikFileInputProps<T> {
    name: T;
    label: string;
    validate?: ((value: any) => string | Promise<void> | undefined);
}

const FormikFileInput = <T extends {}>(): React.FunctionComponent<FormikFileInputProps<T>> => ({
    label,
    name,
    validate
}) => (
    <FormikField validate={validate} name={name}>
        {({ field, form: { errors, submitCount, setFieldValue } }: FormikFieldProps) => {
            const errorMsgProps = submitCount > 0 ? getValidationErrorProps(errors, field.name) : {};
            return (
                <FileInputBase
                    id={field.name}
                    label={label}
                    onFilesSelect={(files) => {
                        setFieldValue(field.name, [...(field.value || []), ...files]);
                    }}
                    {...errorMsgProps}
                />
            );
        }}
    </FormikField>
);

export default FormikFileInput;
