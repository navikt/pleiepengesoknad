import { IntlShape } from 'react-intl';

type valueFunction = (intl: IntlShape) => string;

export interface FieldValidationResultValues {
    [key: string]: string | number | Date | valueFunction | undefined;
}

export interface FieldValidationError {
    key: string;
    values?: FieldValidationResultValues;
}

export type FieldValidationResult = FieldValidationError | undefined | void;
