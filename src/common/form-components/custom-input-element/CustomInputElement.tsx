import * as React from 'react';
import {
    default as ValidationErrorMessage,
    SkjemaelementFeil as ValidationError
} from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import HelperTextButton from '../../components/helper-text-button/HelperTextButton';
import HelperTextPanel from '../../components/helper-text-panel/HelperTextPanel';
const classnames = require('classnames');
import './customInputElement.less';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import { guid } from 'nav-frontend-js-utils';

interface CustomInputElementProps {
    name?: string;
    children: React.ReactNode;
    className?: string;
    label?: string;
    labelHtmlFor?: string;
    labelId?: string;
    validationError?: ValidationError;
    helperText?: string | React.ReactNode;
}

const CustomInputElement: React.FunctionComponent<CustomInputElementProps> = ({
    children,
    name,
    className,
    label,
    labelHtmlFor,
    labelId = guid(),
    validationError,
    helperText
}) => {
    const intl = useIntl();
    const wrapperCls = classnames('skjemaelement', {
        'skjemaelement--harFeil': validationError !== undefined,
        [`${className}`]: className !== undefined,
        'skjemaelement--focusEnabled': validationError !== undefined
    });
    const [showHelperText, setShowHelperText] = React.useState(false);
    const helperTextAriaLabel = intlHelper(intl, showHelperText ? 'hjelpetekst.skjul' : 'hjelpetekst.vis');
    return (
        <div
            className={wrapperCls}
            id={name}
            tabIndex={validationError ? -1 : undefined}
            aria-describedby={labelId ? labelId : ''}>
            {label && (
                <label className="skjemaelement__label" htmlFor={labelHtmlFor} id={labelId ? labelId : ''}>
                    {label}
                    {helperText && (
                        <>
                            <HelperTextButton
                                onClick={() => setShowHelperText(!showHelperText)}
                                ariaLabel={helperTextAriaLabel}
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

export default CustomInputElement;
