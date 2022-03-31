import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { erFrilanserITidsrom } from '../frilanserUtils';

export const getPeriodeSomFrilanserInnenforSøknadsperiode = (
    søknadsperiode: DateRange,
    startdato: Date,
    sluttdato?: Date
): DateRange | undefined => {
    if (erFrilanserITidsrom(søknadsperiode, startdato, sluttdato) === false) {
        return undefined;
    }
    const fromDate: Date = dayjs.max([dayjs(søknadsperiode.from), dayjs(startdato)]).toDate();
    const toDate: Date = sluttdato
        ? dayjs.min([dayjs(søknadsperiode.to), dayjs(sluttdato)]).toDate()
        : søknadsperiode.to;

    return {
        from: fromDate,
        to: toDate,
    };
};
