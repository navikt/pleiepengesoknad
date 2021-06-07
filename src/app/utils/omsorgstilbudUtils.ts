import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

export const MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA = 20;

export const skalSpørreOmOmsorgstilbudPerMåned = (søknadsperiode: DateRange): boolean =>
    dayjs(søknadsperiode.from).isSame(søknadsperiode.to, 'month') === false ||
    dayjs(søknadsperiode.to).diff(søknadsperiode.from, 'days') > MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA;
