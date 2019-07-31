import * as React from 'react';
import { ArrayHelpers, Field as FormikField, FieldArray, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from '../../utils/navFrontendUtils';
import FileInputBase from '../file-input-base/FileInputBase';
import { FormikValidationProps } from 'app/types/FormikProps';

export interface FormikFileInputProps<T> {
    name: T;
    label: string;
    acceptedExtensions: string;
    onFilesSelect: (files: File[], arrayHelpers: ArrayHelpers) => void;
    onClick?: () => void;
}

const FormikFileInput = <T extends {}>(): React.FunctionComponent<FormikFileInputProps<T> & FormikValidationProps> => ({
    label,
    name,
    acceptedExtensions,
    validate,
    onFilesSelect,
    intl,
    onClick
}) => (
    <FieldArray
        name={`${name}`}
        render={(arrayHelpers) => (
            <FormikField validate={validate} name={name}>
                {({ field, form: { errors, submitCount } }: FormikFieldProps) => {
                    const errorMsgProps =
                        submitCount > 0 ? getValidationErrorPropsWithIntl(intl, errors, field.name) : {};
                    return (
                        <FileInputBase
                            id={field.name}
                            name={field.name}
                            label={label}
                            onClick={onClick}
                            onFilesSelect={(files) => onFilesSelect(files, arrayHelpers)}
                            multiple={true}
                            acceptedExtensions={acceptedExtensions}
                            {...errorMsgProps}
                        />
                    );
                }}
            </FormikField>
        )}
    />
);

export default FormikFileInput;
