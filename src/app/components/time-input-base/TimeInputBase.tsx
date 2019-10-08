import React, { useState } from 'react';
import bemUtils from 'app/utils/bemUtils';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { guid } from 'nav-frontend-js-utils';
import { Time } from 'app/types/Time';
import AriaAlternative from '../aria/AriaAlternative';

import './timeInput.less';

const MAX_HOURS = 23;
const MAX_MINUTES = 59;

type TimeInputChangeFunc = (time: Partial<Time> | undefined) => void;

interface TimeInputProps {
    name: string;
    label: string;
    feil?: SkjemaelementFeil;
    time?: Time | undefined;
    maxHours?: number;
    maxMinutes?: number;
    onChange: TimeInputChangeFunc;
    layout?: 'normal' | 'compact';
}

const bem = bemUtils('timeInput');

const handleTimeChange = (time: Partial<Time>, onChange: TimeInputChangeFunc) => {
    if ((time.hours === undefined || isNaN(time.hours)) && (time.minutes === undefined || isNaN(time.minutes))) {
        onChange(undefined);
    } else {
        onChange(time);
    }
};

const getNewTime = (
    stateTime: Partial<Time> | undefined = {},
    values: { hours?: string; minutes?: string }
): Partial<Time> => {
    if (values.hours !== undefined) {
        const hours = parseInt(values.hours, 10);
        if (!isNaN(hours)) {
            return {
                ...stateTime,
                hours
            };
        }
        return stateTime.minutes ? { ...stateTime, hours: undefined } : { hours: undefined };
    }
    if (values.minutes !== undefined) {
        const minutes = parseInt(values.minutes, 10);
        if (!isNaN(minutes)) {
            return {
                ...stateTime,
                minutes
            };
        }
        return stateTime.hours ? { ...stateTime, minutes: undefined } : { minutes: undefined };
    }

    return stateTime;
};

const TimeInputBase: React.FunctionComponent<TimeInputProps> = ({
    name,
    time = { hours: undefined, minutes: undefined },
    label,
    feil,
    maxHours = MAX_HOURS,
    maxMinutes = MAX_MINUTES,
    onChange,
    layout = 'compact'
}) => {
    const [stateTime, setStateTime] = useState<Partial<Time> | undefined>(time);
    const hours =
        !stateTime || stateTime.hours === undefined || isNaN(stateTime.hours)
            ? ''
            : Math.min(stateTime.hours, maxHours);
    const minutes =
        !stateTime || stateTime.minutes === undefined || isNaN(stateTime.minutes)
            ? ''
            : Math.min(stateTime.minutes, maxMinutes);
    const id = guid();
    const hoursLabelId = `${id}-hours`;
    const minutesLabelId = `${id}-minutes`;

    return (
        <CustomInputElement
            name={name}
            label={label}
            validationError={feil}
            className={bem.classNames(bem.block, bem.modifier(layout))}>
            <div className={bem.element('contentWrapper')}>
                <div className={bem.element('inputWrapper')}>
                    <label className={bem.element('label')} htmlFor={hoursLabelId}>
                        <AriaAlternative ariaText={`timer ${label}`} visibleText={'timer'} />
                    </label>
                    <input
                        id={hoursLabelId}
                        className={bem.element('hours')}
                        type="number"
                        min={0}
                        max={maxHours}
                        maxLength={2}
                        value={hours}
                        autoComplete="off"
                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                            const newTime = getNewTime(stateTime, { hours: evt.target.value });
                            setStateTime(newTime);
                            handleTimeChange(newTime, onChange);
                        }}
                    />
                </div>
                <div className={bem.element('inputWrapper')}>
                    <label className={bem.element('label')} htmlFor={minutesLabelId}>
                        <AriaAlternative ariaText={`minutter ${label}`} visibleText={'minutter'} />
                    </label>
                    <input
                        id={minutesLabelId}
                        className={bem.element('minutes')}
                        type="number"
                        min={0}
                        maxLength={2}
                        max={maxMinutes}
                        value={minutes}
                        autoComplete="off"
                        onBlur={(evt: React.FocusEvent<HTMLInputElement>) => {
                            if (evt.target.value === '' || evt.target.value === '0') {
                                const newTime = {
                                    ...stateTime,
                                    minutes: stateTime && stateTime.hours !== undefined ? 0 : undefined
                                };
                                setStateTime(newTime);
                                handleTimeChange(newTime, onChange);
                            }
                        }}
                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                            const newTime = getNewTime(stateTime, { minutes: evt.target.value });
                            setStateTime(newTime);
                            handleTimeChange(newTime, onChange);
                        }}
                    />
                </div>
            </div>
        </CustomInputElement>
    );
};
export default TimeInputBase;
