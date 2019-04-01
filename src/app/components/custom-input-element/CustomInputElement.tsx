import * as React from 'react';
import {
    default as ValidationErrorMessage,
    SkjemaelementFeil as ValidationError
} from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
const classnames = require('classnames');

interface CustomInputElementProps {
    children: React.ReactNode;
    className?: string;
    label?: string;
    id?: string;
    validationError?: ValidationError;
}

const CustomInputElement: React.FunctionComponent<CustomInputElementProps> = ({
    children,
    className,
    label,
    id,
    validationError
}) => {
    const wrapperCls = classnames('skjemaelement', {
        'skjemaelement--harFeil': validationError !== undefined,
        [`${className}`]: className !== undefined
    });
    return (
        <div className={wrapperCls}>
            {label && (
                <label className="skjemaelement__label" htmlFor={id}>
                    {label}
                </label>
            )}
            {children}
            <ValidationErrorMessage feil={validationError} />
        </div>
    );
};

export default CustomInputElement;
