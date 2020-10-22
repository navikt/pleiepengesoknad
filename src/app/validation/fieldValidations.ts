import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { isISODateString } from 'nav-datovelger';
import { Attachment } from '@sif-common/core/types/Attachment';
import { Time } from '@sif-common/core/types/Time';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@sif-common/core/utils/attachmentUtils';
import {
    date1YearAgo,
    date1YearFromNow,
    DateRange,
    dateRangesCollide,
    dateRangesExceedsRange,
    dateRangesHasFromDateEqualPreviousRangeToDate,
    dateToday,
    isMoreThan3YearsAgo,
} from '@sif-common/core/utils/dateUtils';
import { timeToDecimalTime } from '@sif-common/core/utils/timeUtils';
import {
    createFieldValidationError,
    fieldIsRequiredError,
    FieldValidationErrors,
} from '@sif-common/core/validation/fieldValidations';
import { hasValue } from '@sif-common/core/validation/hasValue';
import { FieldValidationResult } from '@sif-common/core/validation/types';
import { Ferieuttak } from '@sif-common/forms/ferieuttak/types';
import { Utenlandsopphold } from '@sif-common/forms/utenlandsopphold/types';
import { Arbeidsforhold, Tilsynsordning } from '../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../utils/arbeidsforholdUtils';
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
    'samlet_storrelse_for_hoy' = 'fieldvalidation.samlet_storrelse_for_hoy',
    'arbeidsforhold_timerUgyldig' = 'fieldvalidation.arbeidsforhold_timerUgyldig',
    'arbeidsforhold_timerUgyldig_under_1_prosent' = 'fieldvalidation.arbeidsforhold_timerUgyldig_under_1_prosent',
    'arbeidsforhold_timerUgyldig_over_99_prosent' = 'fieldvalidation.arbeidsforhold_timerUgyldig_over_99_prosent',
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
    'ferieuttak_utenfor_periode' = 'fieldvalidation.ferieuttak_utenfor_periode',
    'dato_ugyldig' = 'fieldvalidation.dato_ugyldig',
}

const MAX_ARBEIDSTIMER_PER_UKE = 150;
const MIN_ARBEIDSTIMER_PER_UKE = 1;

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | FieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | FieldValidationErrors>(error, values);
};

export const isYesOrNoAnswered = (answer: YesOrNo) => {
    return answer === YesOrNo.NO || answer === YesOrNo.YES || answer === YesOrNo.DO_NOT_KNOW;
};

export const validateDateString = (dateString: string | undefined, isRequired?: boolean) => {
    if (isRequired && (dateString === undefined || dateString === '')) {
        return fieldIsRequiredError();
    }
    if (isISODateString(dateString) === false) {
        return createAppFieldValidationError(AppFieldValidationErrors.dato_ugyldig, { dateString });
    }
    return undefined;
};

export const validateFødselsdato = (dateString?: string): FieldValidationResult => {
    const dateStringValidationError = validateDateString(dateString, true);
    if (dateStringValidationError) {
        return dateStringValidationError;
    }
    if (dateString && moment(ISOStringToDate(dateString)).isAfter(dateToday)) {
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

export const validateFradato = (fraDatoValue?: string, tilDatoValue?: string): FieldValidationResult => {
    const dateStringValidationError = validateDateString(fraDatoValue, true);
    if (dateStringValidationError) {
        return dateStringValidationError;
    }
    const fraDato = ISOStringToDate(fraDatoValue);
    const tilDato = ISOStringToDate(tilDatoValue);
    if (fraDato && isMoreThan3YearsAgo(fraDato)) {
        return createAppFieldValidationError(AppFieldValidationErrors.fradato_merEnnTreÅr);
    }
    if (tilDato && moment(fraDato).isAfter(tilDato)) {
        return createAppFieldValidationError(AppFieldValidationErrors.fradato_erEtterTildato);
    }
    return undefined;
};

export const validateTildato = (tilDatoValue?: string, fraDatoValue?: string): FieldValidationResult => {
    const dateStringValidationError = validateDateString(tilDatoValue, true);
    if (dateStringValidationError) {
        return dateStringValidationError;
    }
    const tilDato = ISOStringToDate(tilDatoValue);
    const fraDato = ISOStringToDate(fraDatoValue);
    if (!tilDato || isMoreThan3YearsAgo(tilDato)) {
        return createAppFieldValidationError(AppFieldValidationErrors.tildato_merEnnTreÅr);
    }
    if (fraDato && moment(tilDato).isBefore(fraDato)) {
        return createAppFieldValidationError(AppFieldValidationErrors.tildato_erFørFradato);
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
    // if (dateRangesExceedsRange(dateRanges, periode)) {
    //     return createAppFieldValidationError(AppFieldValidationErrors.ferieuttak_utenfor_periode);
    // }
    return undefined;
};

export const validateLegeerklæring = (attachments: Attachment[]): FieldValidationResult => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    const totalSizeInBytes: number = getTotalSizeOfAttachments(attachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return createAppFieldValidationError(AppFieldValidationErrors.samlet_storrelse_for_hoy);
    }
    // if (uploadedAttachments.length === 0) {
    //     return createAppFieldValidationError(AppFieldValidationErrors.legeerklæring_mangler);
    // }
    if (uploadedAttachments.length > 100) {
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
        if (hoursInTotal > 37.5) {
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
            max: MAX_ARBEIDSTIMER_PER_UKE,
        });
    }
    return undefined;
};

export const validateReduserteArbeidTimer = (
    value: number | string,
    jobberNormaltTimer: number,
    isRequired?: boolean
): FieldValidationResult => {
    if (isRequired && !hasValue(value)) {
        return fieldIsRequiredError();
    }
    const skalJobbeTimer = typeof value === 'string' ? parseFloat(value) : value;
    const pst = calcRedusertProsentFromRedusertTimer(jobberNormaltTimer, skalJobbeTimer);
    if (pst < 1) {
        return createAppFieldValidationError(AppFieldValidationErrors.arbeidsforhold_timerUgyldig_under_1_prosent);
    }
    if (pst > 99) {
        return createAppFieldValidationError(AppFieldValidationErrors.arbeidsforhold_timerUgyldig_over_99_prosent);
    }
    return undefined;
};
