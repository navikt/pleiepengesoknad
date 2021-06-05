import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

export const skalSpørreOmOmsorgstilbudPerMåned = (søknadsperiode: DateRange): boolean =>
    dayjs(søknadsperiode.from).isSame(søknadsperiode.to, 'month') === false &&
    dayjs(søknadsperiode.to).diff(søknadsperiode.from, 'days') > 20;
