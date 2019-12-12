import * as React from 'react';
import { Select, SelectProps } from 'nav-frontend-skjema';
import LabelWithHelperText from '../../components/label-with-helper-text/LabelWithHelperText';
import './selectBase.less';

export interface SelectBaseProps {
    helperText?: string;
}

const SelectBase = ({ label, children, feil, helperText, ...restProps }: SelectBaseProps & SelectProps) => {
    return (
        <Select
            className={'nav_frontend_skjemaelement_select'}
            {...restProps}
            label={
                helperText && helperText.length > 0 ? (
                    <LabelWithHelperText helperText={helperText} htmlFor={name}>
                        {label}
                    </LabelWithHelperText>
                ) : (
                    label
                )
            }
            feil={feil}>
            {children}
        </Select>
    );
};

export default SelectBase;
