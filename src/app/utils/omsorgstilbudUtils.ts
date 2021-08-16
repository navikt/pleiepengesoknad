import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
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

export const getPeriodeFørSøknadsdato = (søknadsperiode: DateRange): DateRange | undefined => {
    if (starterSøknadsperiodeFørDagensDato(søknadsperiode)) {
        return {
            from: søknadsperiode.from,
            to: dayjs(dateToday).subtract(1, 'day').toDate(),
        };
    }
    return undefined;
};

export const getPeriodeFraOgMedSøknadsdato = (søknadsperiode: DateRange): DateRange | undefined => {
    if (fortsetterSøknadsperiodeEtterDagensDato(søknadsperiode)) {
        return {
            from: dateToday,
            to: søknadsperiode.to,
        };
    }
    return undefined;
};

export const starterSøknadsperiodeFørDagensDato = (søknadsperiode: DateRange): boolean =>
    dayjs(søknadsperiode.from).isBefore(dateToday, 'day');

export const fortsetterSøknadsperiodeEtterDagensDato = (søknadsperiode: DateRange): boolean =>
    dayjs(søknadsperiode.to).isSameOrAfter(dateToday, 'day');

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
