import * as React from 'react';
import {
    default as ValidationErrorMessage,
    SkjemaelementFeil as ValidationError
} from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextButton from '../helper-text-button/HelperTextButton';
import HelperTextPanel from '../helper-text-panel/HelperTextPanel';
const classnames = require('classnames');
import './customInputElement.less';
import intlHelper from 'app/utils/intlUtils';
import { injectIntl, WrappedComponentProps } from 'react-intl';

interface CustomInputElementProps {
    children: React.ReactNode;
    className?: string;
    label?: string;
    labelHtmlFor?: string;
    labelId?: string;
    validationError?: ValidationError;
    helperText?: string | React.ReactNode;
}

const CustomInputElement: React.FunctionComponent<CustomInputElementProps & WrappedComponentProps> = ({
    children,
    className,
    label,
    labelHtmlFor,
    labelId,
    validationError,
    helperText,
    intl
}) => {
    const wrapperCls = classnames('skjemaelement', {
        'skjemaelement--harFeil': validationError !== undefined,
        [`${className}`]: className !== undefined
    });
    const [showHelperText, setShowHelperText] = React.useState(false);
    const ariaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    return (
        <div className={wrapperCls}>
            {label && (
                <label className="skjemaelement__label" htmlFor={labelHtmlFor} id={labelId ? labelId : ''}>
                    {label}
                    {helperText && (
                        <>
                            <HelperTextButton
                                onClick={() => setShowHelperText(!showHelperText)}
                                ariaLabel={ariaLabel}
                                ariaPressed={showHelperText}
                            />
                            {showHelperText && <HelperTextPanel>{helperText}</HelperTextPanel>}
                        </>
                    )}
                </label>
            )}
            {children}
            <ValidationErrorMessage feil={validationError} />
        </div>
    );
};

export default injectIntl(CustomInputElement);
