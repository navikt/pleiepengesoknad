import * as React from 'react';
import {
    default as ValidationErrorMessage,
    SkjemaelementFeil as ValidationError
} from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
const classnames = require('classnames');

interface CustomInputElementProps {
    children: React.ReactNode;
    label: string;
    id?: string;
    validationError?: ValidationError;
}

const CustomInputElement: React.FunctionComponent<CustomInputElementProps> = ({
    children,
    label,
    id,
    validationError
}) => {
    const wrapperCls = classnames('skjemaelement', { 'skjemaelement--harFeil': validationError !== undefined });
    const inputCls = classnames({ 'skjema__feilomrade--harFeil': validationError !== undefined });
    return (
        <div className={wrapperCls}>
            <label htmlFor={id}>{label}</label>
            <div className={inputCls}>{children}</div>
            <ValidationErrorMessage feil={validationError} />
        </div>
    );
};

export default CustomInputElement;
