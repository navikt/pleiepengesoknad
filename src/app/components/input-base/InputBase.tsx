import * as React from 'react';
import { Input as NAVInput, NavFrontendInputProps as NAVInputProps } from 'nav-frontend-skjema';
import LabelWithHelperText from '../label-with-helper-text/LabelWithHelperText';
import { InputType } from '../../types/InputType';
import './inputBase.less';

interface InputBaseProps {
    maxLength?: number;
    helperText?: string;
    type?: InputType;
}

type Props = NAVInputProps & InputBaseProps;

const InputBase: React.FunctionComponent<Props> = ({ helperText, ...otherProps }: Props) => {
    if (helperText && helperText.length > 0) {
        const { label, name } = otherProps;
        return (
            <NAVInput
                {...otherProps}
                className="nav_frontend_skjemaelement_input"
                label={
                    <LabelWithHelperText helperText={helperText} htmlFor={name}>
                        {label}
                    </LabelWithHelperText>
                }
                autoComplete="off"
            />
        );
    }
    return <NAVInput {...otherProps} className="nav_frontend_skjemaelement_input" autoComplete="off" />;
};

export default InputBase;
