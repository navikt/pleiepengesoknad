import flatten from 'flat';

interface HasSubmittedValidFormProps {
    isSubmitting: boolean;
    isValid: boolean;
}

export const showValidationErrors = (
    formikStatus: undefined | { stepSubmitCount: number },
    submitCount: number
): boolean => formikStatus !== undefined && submitCount > formikStatus.stepSubmitCount;

export const userHasSubmittedValidForm = (
    oldProps: HasSubmittedValidFormProps,
    currentProps: HasSubmittedValidFormProps
) => oldProps.isSubmitting === true && currentProps.isSubmitting === false && currentProps.isValid === true;

export function resetFieldValue<T extends string, FormDataType>(
    fieldName: T,
    setFieldValue: (field: string, value: any) => void,
    initialValues: FormDataType
) {
    setFieldValue(fieldName, initialValues[fieldName as string]);
}

export function resetFieldValues<T extends string, FormDataType>(
    fieldNames: T[],
    setFieldValue: (field: string, value: any) => void,
    initialValues: FormDataType
) {
    fieldNames.forEach((fieldName) => resetFieldValue(fieldName, setFieldValue, initialValues));
}

export const isCheckboxChecked = (fieldValues: any[], value: any, keyProp?: string): boolean => {
    return keyProp ? (fieldValues || []).some((cv) => cv[keyProp] === value[keyProp]) : fieldValues.includes(value);
};

export function flattenFieldArrayErrors<T>(errors: T): T {
    let allErrors: any = {};
    Object.keys(errors).forEach((key) => {
        const error = errors[key];
        if (isFieldArrayErrors(error)) {
            (error as T[]).forEach((err, idx) => {
                allErrors = {
                    ...allErrors,
                    ...getErrorsFromFieldArrayErrors(err, key, idx)
                };
            });
        } else if (error.key) {
            allErrors[key] = error;
        } else if (typeof error === 'object') {
            const errorNode = findErrorNodeInObject(key, error);
            if (errorNode) {
                allErrors[errorNode.field] = errorNode.error;
            }
        }
    });
    return allErrors;
}

interface ErrorNodeInObject {
    field: string;
    error: {
        key: string;
        values: object;
    };
}

const findErrorNodeInObject = (key: string, error: object): undefined | ErrorNodeInObject => {
    const flatError: object = flatten({ [key]: error });
    const keys = Object.keys(flatError);
    if (keys.length === 2) {
        const field = keys[0].split('.key')[0];
        return {
            field,
            error: {
                key: flatError[keys[0]],
                values: flatten.unflatten(flatError[keys[1]])
            }
        };
    }
    return undefined;
};

const isFieldArrayErrors = (error: any): boolean => {
    if (typeof error === 'object' && error.length && error.length > 0) {
        return true;
    }
    return false;
};

function getErrorsFromFieldArrayErrors<T>(field: T, fieldArrayKey: string, index: number): {} {
    const errors: any = {};
    Object.keys(field).forEach((key) => {
        errors[`${fieldArrayKey}.${index}.${key}`] = field[key];
    });
    return errors;
}
