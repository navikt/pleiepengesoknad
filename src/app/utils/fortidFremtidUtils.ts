import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';

dayjs.extend(minMax);

export const getSøkerKunHistoriskPeriode = (søknadsperiode: DateRange, søknadsdato: Date) =>
    dayjs(søknadsperiode.to).isBefore(søknadsdato, 'day');

export const getHistoriskPeriode = (søknadsperiode: DateRange, søknadsdato: Date): DateRange | undefined => {
    const yesterday = dayjs(søknadsdato).subtract(1, 'day').toDate();
    if (dayjs(søknadsperiode.from).isBefore(søknadsdato, 'day')) {
        return {
            from: søknadsperiode.from,
            to: dayjs.min([dayjs(søknadsperiode.to), dayjs(yesterday)]).toDate(),
        };
    }
    return undefined;
};

export const getPlanlagtPeriode = (søknadsperiode: DateRange, søknadsdato: Date): DateRange | undefined => {
    const from: Date = dayjs.max([dayjs(søknadsdato), dayjs(søknadsperiode.from)]).toDate();
    if (dayjs(søknadsperiode.to).isSameOrAfter(søknadsdato, 'day')) {
        return {
            from,
            to: søknadsperiode.to,
        };
    }
    return undefined;
};
