import { Ferieuttak } from 'common/forms/ferieuttak/types';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { Attachment } from 'common/types/Attachment';
import { Time } from 'common/types/Time';
import { YesOrNo } from 'common/types/YesOrNo';
import { attachmentHasBeenUploaded } from 'common/utils/attachmentUtils';
import {
    date1YearAgo, date1YearFromNow, DateRange, dateRangesCollide, dateRangesExceedsRange,
    dateRangesHasFromDateEqualPreviousRangeToDate, dateToday, isMoreThan3YearsAgo
} from 'common/utils/dateUtils';
import { timeToDecimalTime } from 'common/utils/timeUtils';
import {
    createFieldValidationError, fieldIsRequiredError, FieldValidationErrors
} from 'common/validation/fieldValidations';
import { hasValue } from 'common/validation/hasValue';
import { FieldValidationResult } from 'common/validation/types';
import { Arbeidsforhold, Tilsynsordning } from '../types/PleiepengesøknadFormData';
import { sumTimerMedTilsyn } from '../utils/tilsynUtils';

const moment = require('moment');

export enum AppFieldValidationErrors {
    'fødselsdato_ugyldig' = 'fieldvalidation.fødelsdato.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'bekreftOmsorg_ekstrainfoForMangeTegn' = 'fieldvalidation.bekreftOmsorg_ekstrainfoForMangeTegn',
    'legeerklæring_mangler' = 'fieldvalidation.legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'fieldvalidation.legeerklæring.forMangeFiler',
    'arbeidsforhold_timerUgyldig' = 'fieldvalidation.arbeidsforhold_timerUgyldig',
    'arbeidsforhold_prosentUgyldig' = 'fieldvalidation.arbeidsforhold_prosentUgyldig',
    'arbeidsforhold_redusertMerEnnNormalt' = 'fieldvalidation.arbeidsforhold_redusertMerEnnNormalt',
    'tilsynsordning_ingenInfo' = 'fieldvalidation.tilsynsordning_ingenInfo',
    'tilsynsordning_forMangeTimerTotalt' = 'fieldvalidation.tilsynsordning_forMangeTimerTotalt',
    'tilsynsordning_forMangeTimerEnDag' = 'fieldvalidation.tilsynsordning_forMangeTimerEnDag',
    'tilsynsordning_forMangeTegn' = 'fieldvalidation.tilsynsordning_forMangeTegn',
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_overlapper_samme_start_slutt' = 'fieldvalidation.utenlandsopphold_overlapper_samme_start_slutt',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode',
    'ferieuttak_ikke_registrert' = 'fieldvalidation.ferieuttak_ikke_registrert',
    'ferieuttak_overlapper' = 'fieldvalidation.ferieuttak_overlapper',
    'ferieuttak_utenfor_periode' = 'fieldvalidation.ferieuttak_utenfor_periode'
}

const MAX_ARBEIDSTIMER_PER_UKE = 150;
const MIN_ARBEIDSTIMER_PER_UKE = 1;

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | FieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | FieldValidationErrors>(error, values);
};

export const validateFødselsdato = (date: Date): FieldValidationResult => {
    if (!hasValue(date)) {
        return fieldIsRequiredError();
    }
    if (moment(date).isAfter(dateToday)) {
        return createAppFieldValidationError(AppFieldValidationErrors.fødselsdato_ugyldig);
    }
    return undefined;
};

export const validateValgtBarn = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateNavn = (v: string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired === true && !hasValue(v)) {
        return fieldIsRequiredError();
    }

    const maxNumOfLetters = 50;
    const nameIsValid = v.length <= maxNumOfLetters;

    return nameIsValid
        ? undefined
        : createAppFieldValidationError(AppFieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters });
};

export const validateFradato = (fraDato?: Date, tilDato?: Date): FieldValidationResult => {
    if (!hasValue(fraDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(fraDato!)) {
        return createAppFieldValidationError(AppFieldValidationErrors.fradato_merEnnTreÅr);
    }

    if (hasValue(tilDato)) {
        if (moment(fraDato).isAfter(tilDato)) {
            return createAppFieldValidationError(AppFieldValidationErrors.fradato_erEtterTildato);
        }
    }

    return undefined;
};

export const validateTildato = (tilDato?: Date, fraDato?: Date): FieldValidationResult => {
    if (!hasValue(tilDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(tilDato!)) {
        return createAppFieldValidationError(AppFieldValidationErrors.tildato_merEnnTreÅr);
    }

    if (hasValue(fraDato)) {
        if (moment(tilDato).isBefore(fraDato)) {
            return createAppFieldValidationError(AppFieldValidationErrors.tildato_erFørFradato);
        }
    }

    return undefined;
};

export const validateTextarea1000 = (text: string): FieldValidationResult => {
    if (text && text.length > 1000) {
        return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateBekreftOmsorgEkstrainfo = (text: string): FieldValidationResult => {
    if (!hasValue(text)) {
        return fieldIsRequiredError();
    }
    if (text && text.length > 1000) {
        return createAppFieldValidationError(AppFieldValidationErrors.bekreftOmsorg_ekstrainfoForMangeTegn);
    }
    return undefined;
};

export const validateTilsynsordningTilleggsinfo = (text: string): FieldValidationResult => {
    if (text !== undefined && text.length > 1000) {
        return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateNattevåkTilleggsinfo = (text: string): FieldValidationResult => {
    if (!hasValue(text)) {
        return fieldIsRequiredError();
    }
    if (text.length > 1000) {
        return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateBeredskapTilleggsinfo = (text: string): FieldValidationResult => {
    if (!hasValue(text)) {
        return fieldIsRequiredError();
    }
    if (text.length > 1000) {
        return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateUtenlandsoppholdSiste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }

    return undefined;
};

export const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    if (dateRangesHasFromDateEqualPreviousRangeToDate(dateRanges)) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper_samme_start_slutt);
    }

    return undefined;
};

export const validateUtenlandsoppholdIPerioden = (
    periode: DateRange,
    utenlandsopphold: Utenlandsopphold[]
): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    if (dateRangesHasFromDateEqualPreviousRangeToDate(dateRanges)) {
        return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper_samme_start_slutt);
    }
    return undefined;
};

export const validateFerieuttakIPerioden = (periode: DateRange, ferieuttak: Ferieuttak[]): FieldValidationResult => {
    if (ferieuttak.length === 0) {
        return createAppFieldValidationError(AppFieldValidationErrors.ferieuttak_ikke_registrert);
    }
    const dateRanges = ferieuttak.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return createAppFieldValidationError(AppFieldValidationErrors.ferieuttak_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return createAppFieldValidationError(AppFieldValidationErrors.ferieuttak_utenfor_periode);
    }
    return undefined;
};

export const validateLegeerklæring = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    if (uploadedAttachments.length === 0) {
        return createAppFieldValidationError(AppFieldValidationErrors.legeerklæring_mangler);
    }
    if (uploadedAttachments.length > 3) {
        return createAppFieldValidationError(AppFieldValidationErrors.legeerklæring_forMangeFiler);
    }
    return undefined;
};

export const validateErAnsattIPerioden = (
    arbeidsforhold: Arbeidsforhold[],
    orgnummer: string
): FieldValidationResult => {
    const forhold = arbeidsforhold.find((a) => a.organisasjonsnummer === orgnummer);
    if (
        forhold === undefined ||
        forhold.erAnsattIPerioden === undefined ||
        forhold.erAnsattIPerioden === YesOrNo.UNANSWERED
    ) {
        return fieldIsRequiredError();
    }

    return undefined;
};

export const validateSkalHaTilsynsordning = (tilsynsordning: Tilsynsordning): FieldValidationResult => {
    if (tilsynsordning.skalBarnHaTilsyn === YesOrNo.YES) {
        if (tilsynsordning.ja === undefined) {
            return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_ingenInfo);
        }
        const { ekstrainfo, tilsyn } = tilsynsordning.ja;
        const hasEkstrainformasjon: boolean = (ekstrainfo || '').trim().length > 5;
        const hoursInTotal = tilsyn ? sumTimerMedTilsyn(tilsyn) : 0;
        if (hoursInTotal === 0 && hasEkstrainformasjon === false) {
            return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_ingenInfo);
        }
        if (hoursInTotal >= 37.5) {
            return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTimerTotalt);
        }
    }
    return undefined;
};

export const validateTilsynstimerEnDag = (time: Time): FieldValidationResult => {
    if (time && timeToDecimalTime(time) > 7.5) {
        return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTimerEnDag);
    }
    return undefined;
};

export const validateNormaleArbeidstimer = (time: Time | undefined, isRequired?: boolean): FieldValidationResult => {
    if (isRequired && time === undefined) {
        return fieldIsRequiredError();
    }
    if (time && (time.hours < MIN_ARBEIDSTIMER_PER_UKE || time.hours > MAX_ARBEIDSTIMER_PER_UKE)) {
        return createAppFieldValidationError(AppFieldValidationErrors.arbeidsforhold_timerUgyldig, {
            min: MIN_ARBEIDSTIMER_PER_UKE,
            max: MAX_ARBEIDSTIMER_PER_UKE
        });
    }
    return undefined;
};

export const validateReduserteArbeidTimer = (
    value: number | string,
    normalTimer: Time | undefined,
    isRequired?: boolean
): FieldValidationResult => {
    if (isRequired && !hasValue(value)) {
        return fieldIsRequiredError();
    }
    const timer = typeof value === 'string' ? parseFloat(value) : value;

    if (normalTimer === undefined) {
        return validateNormaleArbeidstimer({ hours: timer, minutes: 0 });
    }

    if (timer < MIN_ARBEIDSTIMER_PER_UKE || timer > MAX_ARBEIDSTIMER_PER_UKE) {
        return createAppFieldValidationError(AppFieldValidationErrors.arbeidsforhold_timerUgyldig, {
            min: MIN_ARBEIDSTIMER_PER_UKE,
            max: Math.max(MAX_ARBEIDSTIMER_PER_UKE, timeToDecimalTime(normalTimer))
        });
    }
    if (timer > (timeToDecimalTime(normalTimer) || MAX_ARBEIDSTIMER_PER_UKE)) {
        return createAppFieldValidationError(AppFieldValidationErrors.arbeidsforhold_redusertMerEnnNormalt);
    }
    return undefined;
};
export const validateReduserteArbeidProsent = (value: number | string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired && !hasValue(value)) {
        return fieldIsRequiredError();
    }
    const prosent = typeof value === 'string' ? parseFloat(value) : value;

    if (prosent < 1 || prosent > 100) {
        return createAppFieldValidationError(AppFieldValidationErrors.arbeidsforhold_prosentUgyldig);
    }
    return undefined;
};
