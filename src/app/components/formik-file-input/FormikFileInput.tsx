import * as React from 'react';
import { ArrayHelpers, Field as FormikField, FieldArray, FieldProps as FormikFieldProps } from 'formik';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import FileInputBase from 'common/form-components/file-input-base/FileInputBase';
import { showValidationErrors } from 'common/formik/formikUtils';
import { useIntl } from 'react-intl';
import { FormikValidationProps } from 'common/formik/FormikProps';

export interface FormikFileInputProps<T> {
    name: T;
    label: string;
    acceptedExtensions: string;
    onFilesSelect: (files: File[], arrayHelpers: ArrayHelpers) => void;
    onClick?: () => void;
}

function FormikFileInput<T>({
    label,
    name,
    acceptedExtensions,
    validate,
    onFilesSelect,
    onClick
}: FormikFileInputProps<T> & FormikValidationProps) {
    const intl = useIntl();
    return (
        <FieldArray
            name={`${name}`}
            render={(arrayHelpers) => (
                <FormikField validate={validate} name={name}>
                    {({ field, form: { errors, status, submitCount } }: FormikFieldProps) => {
                        const errorMsgProps = showValidationErrors(status, submitCount)
                            ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                            : {};
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
}

export default FormikFileInput;
