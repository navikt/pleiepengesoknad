import {
    date1YearAgo,
    date1YearFromNow,
    dateRangesCollide,
    dateRangesExceedsRange,
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';

enum UtenlandsoppholdErrors {
    'utenlandsopphold_ikke_registrert' = 'utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'utenlandsopphold_utenfor_periode',
}

export const validateUtenlandsoppholdSiste12Mnd = (utenlandsopphold: Utenlandsopphold[]): string | undefined => {
    if (utenlandsopphold.length === 0) {
        return UtenlandsoppholdErrors.utenlandsopphold_ikke_registrert;
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return UtenlandsoppholdErrors.utenlandsopphold_overlapper;
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return UtenlandsoppholdErrors.utenlandsopphold_utenfor_periode;
    }
    return undefined;
};

export const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): string | undefined => {
    if (utenlandsopphold.length === 0) {
        return UtenlandsoppholdErrors.utenlandsopphold_ikke_registrert;
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return UtenlandsoppholdErrors.utenlandsopphold_overlapper;
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return UtenlandsoppholdErrors.utenlandsopphold_utenfor_periode;
    }
    return undefined;
};
