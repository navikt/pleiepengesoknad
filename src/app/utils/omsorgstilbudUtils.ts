import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

export const MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA = 5;

export const skalSpørreOmOmsorgstilbudPerMåned = (søknadsperiode: DateRange): boolean => {
    const erSammeMåned = dayjs(søknadsperiode.from).isSame(søknadsperiode.to, 'month');
    const antallDager = dayjs(søknadsperiode.to).diff(søknadsperiode.from, 'days');
    if (erSammeMåned && antallDager <= MAKS_ANTALL_DAGER_FOR_INLINE_SKJEMA) {
        return false;
    }
    return true;
};
