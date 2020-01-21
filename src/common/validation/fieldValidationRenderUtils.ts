import { IntlShape } from 'react-intl';
import { FieldValidationResultValues, FieldValidationError } from './types';
import intlHelper from '../utils/intlUtils';

export const isFieldValidationError = (error: any): error is FieldValidationError =>
    typeof error === 'object' && error.key !== undefined;

export const renderFieldValidationValues = (
    intl: IntlShape,
    values: FieldValidationResultValues | undefined
): { [key: string]: string } | undefined => {
    if (values === undefined) {
        return undefined;
    }
    const parsedValues: { [key: string]: string } = {};
    Object.keys(values).forEach((key) => {
        const valueOrFunc = values[key];
        if (valueOrFunc !== undefined) {
            parsedValues[key] = typeof valueOrFunc === 'function' ? valueOrFunc(intl) : `${valueOrFunc}`;
        }
    });
    return parsedValues;
};

export const renderFieldValidationError = (intl: IntlShape, error: FieldValidationError): string => {
    return intlHelper(intl, error.key, renderFieldValidationValues(intl, error.values));
};
