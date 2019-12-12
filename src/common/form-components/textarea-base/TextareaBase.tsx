import * as React from 'react';
import { Textarea, TextareaProps } from 'nav-frontend-skjema';
import LabelWithHelperText from '../../components/label-with-helper-text/LabelWithHelperText';

import './textareaBase.less';

interface TextareaBaseProps {
    maxLength?: number;
    helperText?: string;
}

type Props = TextareaProps & TextareaBaseProps;

const TextareaBase: React.FunctionComponent<Props> = ({ helperText, ...otherProps }: Props) => {
    if (helperText && helperText.length > 0) {
        const { label, name } = otherProps;
        return (
            <div className="nav_frontend_skjemaelement_textarea">
                <Textarea
                    {...otherProps}
                    label={
                        <LabelWithHelperText helperText={helperText} htmlFor={name} tag="div">
                            {label}
                        </LabelWithHelperText>
                    }
                    autoComplete="off"
                />
            </div>
        );
    }
    return (
        <div className="nav_frontend_skjemaelement_textarea">
            <Textarea {...otherProps} autoComplete="off" />
        </div>
    );
};

export default TextareaBase;
