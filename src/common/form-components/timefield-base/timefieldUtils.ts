import { TimefieldValue } from './TimefieldBase';

const padTime = (time: number): string => `${time}`.padStart(2, '0');

const TimefieldUtils = {
    parseTimefieldStringValue: (value: string): TimefieldValue => {
        const values = value.split(':');
        return {
            hours: parseInt(values[0], 10),
            minutes: parseInt(values[1], 10)
        };
    },

    convertTimefieldValueToString: ({ hours, minutes }: TimefieldValue): string =>
        `${padTime(hours)}:${`${padTime(minutes)}`}`
};

export default TimefieldUtils;
