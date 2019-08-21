import React, { useState } from 'react';
import bemUtils from 'app/utils/bemUtils';
import CustomInputElement from '../custom-input-element/CustomInputElement';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import { isValidTime } from 'app/utils/timeUtils';
import { guid } from 'nav-frontend-js-utils';
import { hasValue } from 'app/validation/fieldValidations';
import { Time } from 'app/types/Time';

import './timeInput.less';

export const MAX_HOURS = 150;
export const MAX_MINUTES = 59;

type TimeInputChangeFunc = (time: Time | undefined) => void;

interface TimeInputProps {
    label: string;
    name: string;
    feil?: SkjemaelementFeil;
    time?: Time | undefined;
    onChange: TimeInputChangeFunc;
}

const bem = bemUtils('timeInput');

const handleTimeChange = (time: Partial<Time>, onChange: TimeInputChangeFunc) => {
    if (isValidTime(time)) {
        onChange(time);
    } else {
        if (time.hours === undefined || isNaN(time.hours) || (time.minutes === undefined || isNaN(time.minutes))) {
            onChange(undefined);
        }
    }
};

const TimeInputBase: React.FunctionComponent<TimeInputProps> = ({
    time = { hours: undefined, minutes: undefined },
    label,
    feil,
    onChange
}) => {
    const [stateTime, setStateTime] = useState<Partial<Time> | undefined>(time);
    const hours =
        !stateTime || stateTime.hours === undefined || isNaN(stateTime.hours)
            ? ''
            : Math.min(stateTime.hours, MAX_HOURS);
    const minutes =
        !stateTime || stateTime.minutes === undefined || isNaN(stateTime.minutes)
            ? ''
            : Math.min(stateTime.minutes, MAX_MINUTES);
    const id = guid();
    const hoursLabelId = `${id}-hours`;
    const minutesLabelId = `${id}-minutes`;

    return (
        <CustomInputElement label={label} validationError={feil}>
            <div className={bem.block}>
                <div className={bem.element('inputWrapper')}>
                    <label className={bem.element('label')} htmlFor={hoursLabelId}>
                        timer
                    </label>
                    <input
                        id={hoursLabelId}
                        className={bem.element('hours')}
                        type="number"
                        min={0}
                        max={MAX_HOURS}
                        maxLength={3}
                        value={hours}
                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                            const newTime = {
                                hours: parseFloat(evt.target.value),
                                minutes: stateTime && hasValue(stateTime.minutes) ? stateTime.minutes : 0
                            };
                            setStateTime(newTime);
                            handleTimeChange(newTime, onChange);
                        }}
                    />
                </div>
                <div className={bem.element('inputWrapper')}>
                    <label className={bem.element('label')} htmlFor={minutesLabelId}>
                        minutter
                    </label>
                    <input
                        id={minutesLabelId}
                        className={bem.element('minutes')}
                        type="number"
                        min={0}
                        maxLength={2}
                        max={MAX_MINUTES}
                        value={minutes}
                        onBlur={(evt: React.FocusEvent<HTMLInputElement>) => {
                            if (evt.target.value === '') {
                                const newTime = {
                                    ...stateTime,
                                    minutes: 0
                                };
                                setStateTime(newTime);
                                handleTimeChange(newTime, onChange);
                            }
                        }}
                        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
                            const mins = parseFloat(evt.target.value);
                            const newTime = {
                                ...stateTime,
                                minutes: isNaN(mins) && evt.target.value !== '' ? 0 : mins
                            };
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
