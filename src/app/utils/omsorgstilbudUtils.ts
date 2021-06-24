import { DateRange } from '@navikt/sif-common-formik/lib';
import { isValidTime } from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import { TidIOmsorgstilbud } from '../components/omsorgstilbud/types';

export const MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA = 20;

export const visKunEnkeltdagerForOmsorgstilbud = (søknadsperiode: DateRange): boolean => {
    const antallDager = dayjs(søknadsperiode.to).diff(søknadsperiode.from, 'days');
    if (antallDager <= MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA) {
        return true;
    }
    return false;
};

const isValidNumberString = (value: any): boolean =>
    hasValue(value) && typeof value === 'string' && value.trim().length > 0;

export const getCleanedTidIOmsorgstilbud = (tidIOmsorg: TidIOmsorgstilbud): TidIOmsorgstilbud => {
    const cleanedTidIOmsorg: TidIOmsorgstilbud = {};
    Object.keys(tidIOmsorg).forEach((key) => {
        const tid = tidIOmsorg[key];
        if (isValidTime(tid) && (isValidNumberString(tid.hours) || isValidNumberString(tid.minutes))) {
            cleanedTidIOmsorg[key] = tid;
        }
    });
    return cleanedTidIOmsorg;
};
