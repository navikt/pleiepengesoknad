import * as React from 'react';
import { Input } from 'nav-frontend-skjema';
import LabelWithHelperText from '../label-with-helper-text/LabelWithHelperText';
import { InputType } from '../../types/InputType';
import Timefield from 'react-simple-timefield';
import TimefieldUtils from './timefieldUtils';

import './timefieldBase.less';

export interface TimefieldValue {
    hours: number;
    minutes: number;
}

type Props = TimefieldBaseProps;

interface TimefieldBaseProps {
    maxLength?: number;
    helperText?: string;
    type?: InputType;
    value: TimefieldValue;
    label: string;
    name: string;
    onChange: (value: TimefieldValue) => void;
}

const TimefieldBase: React.FunctionComponent<Props> = ({ helperText, value, onChange, ...otherProps }: Props) => {
    const { label, name } = otherProps;

    return (
        <Timefield
            value={TimefieldUtils.convertTimefieldValueToString(value)}
            onChange={(v) => {
                onChange(TimefieldUtils.parseTimefieldStringValue(v));
            }}
            input={
                <Input
                    {...otherProps}
                    onChange={() => null} // is set and controller by Timefield
                    autoComplete="off"
                    inputClassName="nav_frontend_skjemaelement_timefield__input"
                    {...(helperText !== undefined && helperText.length > 0
                        ? {
                              className: 'nav_frontend_skjemaelement_timefield',
                              label: (
                                  <LabelWithHelperText helperText={helperText} htmlFor={name}>
                                      {label}
                                  </LabelWithHelperText>
                              )
                          }
                        : undefined)}
                />
            }
        />
    );
};

export default TimefieldBase;
