import * as React from 'react';
import { Input as NAVInput, NavFrontendInputProps as NAVInputProps } from 'nav-frontend-skjema';
import LabelWithHelperText from '../label-with-helper-text/LabelWithHelperText';
import { InputType } from '../../types/InputType';
import bemUtils from '../../utils/bemUtils';
import './inputBase.less';

export interface InputBaseProps {
    maxLength?: number;
    helperText?: string;
    type?: InputType;
    labelRight?: boolean;
}

type Props = NAVInputProps & InputBaseProps;

const bem = bemUtils('nav_frontend_skjemaelement_input');

const InputBase: React.FunctionComponent<Props> = ({ helperText, labelRight, className, ...otherProps }: Props) => {
    const { label, name } = otherProps;
    return (
        <NAVInput
            {...otherProps}
            className={bem.classNames(bem.block, className, labelRight ? 'input--label-right' : undefined)}
            autoComplete="off"
            label={
                helperText && helperText.length > 0 ? (
                    <LabelWithHelperText helperText={helperText} htmlFor={name}>
                        {label}
                    </LabelWithHelperText>
                ) : (
                    label
                )
            }
        />
    );
};

export default InputBase;
