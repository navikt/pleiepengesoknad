import * as React from 'react';
import { Input } from 'nav-frontend-skjema';
import LabelWithHelperText from 'common/components/label-with-helper-text/LabelWithHelperText';
import Timefield from 'react-simple-timefield';
import TimefieldUtils from './timefieldUtils';

import './timefieldBase.less';

export interface TimefieldValue {
    hours: number;
    minutes: number;
}

interface TimefieldBaseProps {
    name: string;
    label: React.ReactNode;
    value: TimefieldValue | undefined;
    onChange: (value: TimefieldValue) => void;
    id?: string;
    disabled?: boolean;
    helperText?: string;
}

const defaultValue: TimefieldValue = { hours: 0, minutes: 0 };

const TimefieldBase: React.FunctionComponent<TimefieldBaseProps> = ({
    helperText,
    value = defaultValue,
    onChange,
    ...otherProps
}: TimefieldBaseProps) => {
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
