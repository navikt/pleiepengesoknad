import { Field, initialValues } from '../types/PleiepengesøknadFormData';

interface HasSubmittedValidFormProps {
    isSubmitting: boolean;
    isValid: boolean;
}

export const userHasSubmittedValidForm = (
    oldProps: HasSubmittedValidFormProps,
    currentProps: HasSubmittedValidFormProps
) => oldProps.isSubmitting === true && currentProps.isSubmitting === false && currentProps.isValid === true;

export const resetFieldValue = (fieldName: Field, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue(fieldName, initialValues[fieldName]);
};

export const resetFieldValues = (fieldNames: Field[], setFieldValue: (field: string, value: any) => void) => {
    fieldNames.forEach((fieldName) => resetFieldValue(fieldName, setFieldValue));
};

export const isCheckboxChecked = (fieldValues: any[], value: any, keyProp?: string): boolean => {
    return keyProp ? fieldValues.some((cv) => cv[keyProp] === value[keyProp]) : fieldValues.includes(value);
};

export const flattenFieldArrayErrors = (errors: Field): Field => {
    let allErrors: any = {};
    Object.keys(errors).forEach((key) => {
        const error = errors[key];
        if (isFieldArrayErrors(error)) {
            (error as Field[]).forEach((err, idx) => {
                allErrors = {
                    ...allErrors,
                    ...getErrorsFromFieldArrayErrors(err, key, idx)
                };
            });
        } else {
            allErrors[key] = error;
        }
    });
    return allErrors;
};

const isFieldArrayErrors = (error: any): boolean => {
    if (typeof error === 'object' && error.length && error.length > 0) {
        return true;
    }
    return false;
};

const getErrorsFromFieldArrayErrors = (field: Field, fieldArrayKey: string, index: number): {} => {
    const errors: any = {};
    Object.keys(field).forEach((key) => {
        errors[`${fieldArrayKey}.${index}.${key}`] = field[key];
    });
    return errors;
};
