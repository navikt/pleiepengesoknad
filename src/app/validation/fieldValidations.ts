import { YesOrNo } from 'common/types/YesOrNo';
import { fødselsnummerIsValid, FødselsnummerValidationErrorReason } from './fødselsnummerValidator';
import {
    isMoreThan3YearsAgo,
    dateRangesCollide,
    dateRangesExceedsRange,
    date1YearAgo,
    date1YearFromNow,
    DateRange,
    dateToday
} from 'common/utils/dateUtils';
import { attachmentHasBeenUploaded } from 'common/utils/attachmentUtils';
import { timeToDecimalTime } from 'common/utils/timeUtils';
import { Time } from 'common/types/Time';
import { Tilsynsordning, Arbeidsforhold } from '../types/PleiepengesøknadFormData';
import { sumTimerMedTilsyn } from '../utils/tilsynUtils';
import { Attachment } from 'common/types/Attachment';
import { FieldValidationResult } from 'common/validation/types';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { hasValue } from 'common/validation/hasValue';
import { Ferieuttak } from 'common/forms/ferieuttak/types';

const moment = require('moment');

export enum FieldValidationErrors {
    'påkrevd' = 'fieldvalidation.påkrevd',
    'fødselsnummer_11siffer' = 'fieldvalidation.fødselsnummer.11siffer',
    'fødselsnummer_ugyldig' = 'fieldvalidation.fødselsnummer.ugyldig',
    'fødselsdato_ugyldig' = 'fieldvalidation.fødelsdato.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'relasjon_maksAntallTegn' = 'fieldvalidation.relasjon.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'legeerklæring_mangler' = 'fieldvalidation.legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'fieldvalidation.legeerklæring.forMangeFiler',
    'arbeidsforhold_timerUgyldig' = 'fieldvalidation.arbeidsforhold_timerUgyldig',
    'arbeidsforhold_prosentUgyldig' = 'fieldvalidation.arbeidsforhold_prosentUgyldig',
    'arbeidsforhold_redusertMerEnnNormalt' = 'fieldvalidation.arbeidsforhold_redusertMerEnnNormalt',
    'dagerPerUkeBorteFraJobb_ugyldig' = 'fieldvalidation.dagerPerUkeBorteFraJobb_ugyldig',
    'tilsynsordning_ingenInfo' = 'fieldvalidation.tilsynsordning_ingenInfo',
    'tilsynsordning_forMangeTimerTotalt' = 'fieldvalidation.tilsynsordning_forMangeTimerTotalt',
    'tilsynsordning_forMangeTimerEnDag' = 'fieldvalidation.tilsynsordning_forMangeTimerEnDag',
    'tilsynsordning_forMangeTegn' = 'fieldvalidation.tilsynsordning_forMangeTegn',
    'utenlandsopphold_ikke_registrert' = 'fieldvalidation.utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'fieldvalidation.utenlandsopphold_overlapper',
    'utenlandsopphold_utenfor_periode' = 'fieldvalidation.utenlandsopphold_utenfor_periode',
    'ferieuttak_ikke_registrert' = 'fieldvalidation.ferieuttak_ikke_registrert',
    'ferieuttak_overlapper' = 'fieldvalidation.ferieuttak_overlapper',
    'ferieuttak_utenfor_periode' = 'fieldvalidation.ferieuttak_utenfor_periode'
}

const MAX_ARBEIDSTIMER_PER_UKE = 150;
const MIN_ARBEIDSTIMER_PER_UKE = 1;

const fieldIsRequiredError = () => fieldValidationError(FieldValidationErrors.påkrevd);

export const validateFødselsnummer = (v: string): FieldValidationResult => {
    const [isValid, reasons] = fødselsnummerIsValid(v);
    if (!isValid) {
        if (reasons.includes(FødselsnummerValidationErrorReason.MustConsistOf11Digits)) {
            return fieldValidationError(FieldValidationErrors.fødselsnummer_11siffer);
        } else {
            return fieldValidationError(FieldValidationErrors.fødselsnummer_ugyldig);
        }
    }
};

export const validateFødselsdato = (date: Date): FieldValidationResult => {
    if (!hasValue(date)) {
        return fieldIsRequiredError();
    }
    if (moment(date).isAfter(dateToday)) {
        return fieldValidationError(FieldValidationErrors.fødselsdato_ugyldig);
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
        : fieldValidationError(FieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters });
};

export const validateRelasjonTilBarnet = (v: string): FieldValidationResult => {
    if (!hasValue(v)) {
        return fieldIsRequiredError();
    }

    const maxNumOfLetters = 15;
    const relasjonIsValid = v.length <= maxNumOfLetters;

    return relasjonIsValid
        ? undefined
        : fieldValidationError(FieldValidationErrors.relasjon_maksAntallTegn, { maxNumOfLetters });
};

export const validateFradato = (fraDato?: Date, tilDato?: Date): FieldValidationResult => {
    if (!hasValue(fraDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(fraDato!)) {
        return fieldValidationError(FieldValidationErrors.fradato_merEnnTreÅr);
    }

    if (hasValue(tilDato)) {
        if (moment(fraDato).isAfter(tilDato)) {
            return fieldValidationError(FieldValidationErrors.fradato_erEtterTildato);
        }
    }

    return undefined;
};

export const validateTildato = (tilDato?: Date, fraDato?: Date): FieldValidationResult => {
    if (!hasValue(tilDato)) {
        return fieldIsRequiredError();
    }

    if (isMoreThan3YearsAgo(tilDato!)) {
        return fieldValidationError(FieldValidationErrors.tildato_merEnnTreÅr);
    }

    if (hasValue(fraDato)) {
        if (moment(tilDato).isBefore(fraDato)) {
            return fieldValidationError(FieldValidationErrors.tildato_erFørFradato);
        }
    }

    return undefined;
};

export const validateTextarea1000 = (text: string): FieldValidationResult => {
    if (text && text.length > 1000) {
        return fieldValidationError(FieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateTilsynsordningTilleggsinfo = (text: string): FieldValidationResult => {
    if (text !== undefined && text.length > 1000) {
        return fieldValidationError(FieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateNattevåkTilleggsinfo = (text: string): FieldValidationResult => {
    if (!hasValue(text)) {
        return fieldIsRequiredError();
    }
    if (text.length > 1000) {
        return fieldValidationError(FieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateBeredskapTilleggsinfo = (text: string): FieldValidationResult => {
    if (!hasValue(text)) {
        return fieldIsRequiredError();
    }
    if (text.length > 1000) {
        return fieldValidationError(FieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateYesOrNoIsAnswered = (answer: YesOrNo): FieldValidationResult => {
    if (answer === YesOrNo.UNANSWERED || answer === undefined) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateUtenlandsoppholdSiste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_utenfor_periode);
    }

    return undefined;
};

export const validateUtenlandsoppholdNeste12Mnd = (utenlandsopphold: Utenlandsopphold[]): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};

export const validateUtenlandsoppholdIPerioden = (
    periode: DateRange,
    utenlandsopphold: Utenlandsopphold[]
): FieldValidationResult => {
    if (utenlandsopphold.length === 0) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_ikke_registrert);
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return fieldValidationError(FieldValidationErrors.utenlandsopphold_utenfor_periode);
    }
    return undefined;
};

export const validateFerieuttakIPerioden = (periode: DateRange, ferieuttak: Ferieuttak[]): FieldValidationResult => {
    if (ferieuttak.length === 0) {
        return fieldValidationError(FieldValidationErrors.ferieuttak_ikke_registrert);
    }
    const dateRanges = ferieuttak.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return fieldValidationError(FieldValidationErrors.ferieuttak_overlapper);
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return fieldValidationError(FieldValidationErrors.ferieuttak_utenfor_periode);
    }
    return undefined;
};

export const validateLegeerklæring = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    if (uploadedAttachments.length === 0) {
        return fieldValidationError(FieldValidationErrors.legeerklæring_mangler);
    }
    if (uploadedAttachments.length > 3) {
        return fieldValidationError(FieldValidationErrors.legeerklæring_forMangeFiler);
    }
    return undefined;
};

export const validateRequiredField = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
    }
    return undefined;
};

export const validateRequiredSelect = (value: any): FieldValidationResult => {
    if (!hasValue(value)) {
        return fieldIsRequiredError();
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
            return fieldValidationError(FieldValidationErrors.tilsynsordning_ingenInfo);
        }
        const { ekstrainfo, tilsyn } = tilsynsordning.ja;
        const hasEkstrainformasjon: boolean = (ekstrainfo || '').trim().length > 5;
        const hoursInTotal = tilsyn ? sumTimerMedTilsyn(tilsyn) : 0;
        if (hoursInTotal === 0 && hasEkstrainformasjon === false) {
            return fieldValidationError(FieldValidationErrors.tilsynsordning_ingenInfo);
        }
        if (hoursInTotal >= 37.5) {
            return fieldValidationError(FieldValidationErrors.tilsynsordning_forMangeTimerTotalt);
        }
    }
    return undefined;
};

export const validateTilsynstimerEnDag = (time: Time): FieldValidationResult => {
    if (time && timeToDecimalTime(time) > 7.5) {
        return fieldValidationError(FieldValidationErrors.tilsynsordning_forMangeTimerEnDag);
    }
    return undefined;
};

export const validateNormaleArbeidstimer = (time: Time | undefined, isRequired?: boolean): FieldValidationResult => {
    if (isRequired && time === undefined) {
        return fieldIsRequiredError();
    }
    if (time && (time.hours < MIN_ARBEIDSTIMER_PER_UKE || time.hours > MAX_ARBEIDSTIMER_PER_UKE)) {
        return fieldValidationError(FieldValidationErrors.arbeidsforhold_timerUgyldig, {
            min: MIN_ARBEIDSTIMER_PER_UKE,
            max: MAX_ARBEIDSTIMER_PER_UKE
        });
    }
    return undefined;
};

export const validateDagerPerUkeBorteFraJobb = (value: string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired && !hasValue(value)) {
        return fieldIsRequiredError();
    }
    const dager = typeof value === 'string' ? parseFloat(value) : value;
    const range = {
        min: 0.5,
        max: 5
    };
    if (isNaN(dager) || dager % 0.5 !== 0 || dager < range.min || dager > range.max) {
        return fieldValidationError(FieldValidationErrors.dagerPerUkeBorteFraJobb_ugyldig, range);
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
        return fieldValidationError(FieldValidationErrors.arbeidsforhold_timerUgyldig, {
            min: MIN_ARBEIDSTIMER_PER_UKE,
            max: Math.max(MAX_ARBEIDSTIMER_PER_UKE, timeToDecimalTime(normalTimer))
        });
    }
    if (timer > (timeToDecimalTime(normalTimer) || MAX_ARBEIDSTIMER_PER_UKE)) {
        return fieldValidationError(FieldValidationErrors.arbeidsforhold_redusertMerEnnNormalt);
    }
    return undefined;
};
export const validateReduserteArbeidProsent = (value: number | string, isRequired?: boolean): FieldValidationResult => {
    if (isRequired && !hasValue(value)) {
        return fieldIsRequiredError();
    }
    const prosent = typeof value === 'string' ? parseFloat(value) : value;

    if (prosent < 1 || prosent > 100) {
        return fieldValidationError(FieldValidationErrors.arbeidsforhold_prosentUgyldig);
    }
    return undefined;
};

export const fieldValidationError = (key: FieldValidationErrors | undefined, values?: any): FieldValidationResult => {
    return key
        ? {
              key,
              values
          }
        : undefined;
};
