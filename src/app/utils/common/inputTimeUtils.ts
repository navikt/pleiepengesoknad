import { InputTime } from '@navikt/sif-common-formik/lib';
import moize from 'moize';
import { inputTimeToISODuration } from './isoDurationUtils';

export const ensureTime = (time: Partial<InputTime> | undefined): InputTime => {
    return {
        hours: time?.hours || '0',
        minutes: time?.minutes || '0',
    };
};

const _inputTimeDurationIsZero = (time: Partial<InputTime>): boolean => {
    return inputTimeToISODuration(time) === 'PT0H0M';
};
export const inputTimeDurationIsZero = moize(_inputTimeDurationIsZero);

const _timeHasSameDuration = (time1?: InputTime, time2?: InputTime): boolean => {
    if (time1 === undefined && time2 === undefined) {
        return true;
    }
    if (time1 === undefined || time2 === undefined) {
        return false;
    }
    const endretTid = inputTimeToISODuration(time1);
    const opprinneligTid = inputTimeToISODuration(time2);
    return endretTid === opprinneligTid;
};
export const timeHasSameDuration = moize(_timeHasSameDuration);
