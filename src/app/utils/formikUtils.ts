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
