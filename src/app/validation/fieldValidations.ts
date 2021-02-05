import moment from 'moment';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import {
    date1YearAgo,
    date1YearFromNow,
    DateRange,
    dateRangesCollide,
    dateRangesExceedsRange,
    dateRangesHasFromDateEqualPreviousRangeToDate,
    dateToday,
    isMoreThan3YearsAgo,
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import {
    createFieldValidationError,
    fieldIsRequiredError,
    FieldValidationErrors,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { FieldValidationResult } from '@navikt/sif-common-core/lib/validation/types';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib/utenlandsopphold/types';
import { Arbeidsforhold, Tilsynsordning } from '../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../utils/arbeidsforholdUtils';
import { sumTimerMedTilsyn } from '../utils/tilsynUtils';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export enum AppFieldValidationErrors {
    'fødselsdato_ugyldig' = 'fieldvalidation.fødelsdato.ugyldig',
    'navn_maksAntallTegn' = 'fieldvalidation.navn.maksAntallTegn',
    'fradato_merEnnTreÅr' = 'fieldvalidation.fradato.merEnnTreÅr',
    'fradato_erEtterTildato' = 'fieldvalidation.fradato.erEtterTildato',
    'tildato_merEnnTreÅr' = 'fieldvalidation.tildato.merEnnTreÅr',
    'tildato_erFørFradato' = 'fieldvalidation.tildato.erFørFradato',
    'frilanser_startdatoForSent' = 'fieldvalidation.tildato.frilanser_startdatoForSent',
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
    'er_helg' = 'fieldvalidation.er_helg',
}

export const createAppFieldValidationError = (
    error: AppFieldValidationErrors | FieldValidationErrors,
    values?: any
): FieldValidationResult => {
    return createFieldValidationError<AppFieldValidationErrors | FieldValidationErrors>(error, values);
};

export const isYesOrNoAnswered = (answer: YesOrNo) => {
    return answer === YesOrNo.NO || answer === YesOrNo.YES || answer === YesOrNo.DO_NOT_KNOW;
};

export const validateFødselsdato = (dateString?: string): FieldValidationResult => {
    const date = datepickerUtils.getDateFromDateString(dateString);
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

export const validateFradato = (fraDatoString?: string, tilDatoString?: string): FieldValidationResult => {
    const fraDato = datepickerUtils.getDateFromDateString(fraDatoString);
    const tilDato = datepickerUtils.getDateFromDateString(tilDatoString);
    if (!hasValue(fraDato)) {
        return fieldIsRequiredError();
    }

    if (!fraDato || isMoreThan3YearsAgo(fraDato)) {
        return createAppFieldValidationError(AppFieldValidationErrors.fradato_merEnnTreÅr);
    }

    if (hasValue(tilDato)) {
        if (moment(fraDato).isAfter(tilDato)) {
            return createAppFieldValidationError(AppFieldValidationErrors.fradato_erEtterTildato);
        }
    }

    if (dateErHelg(fraDato)) {
        return createFieldValidationError(AppFieldValidationErrors.er_helg);
    }

    return undefined;
};

export const validateTildato = (tilDatoString?: string, fraDatoString?: string): FieldValidationResult => {
    const tilDato = datepickerUtils.getDateFromDateString(tilDatoString);
    const fraDato = datepickerUtils.getDateFromDateString(fraDatoString);

    if (!hasValue(tilDato)) {
        return fieldIsRequiredError();
    }

    if (!tilDato || isMoreThan3YearsAgo(tilDato)) {
        return createAppFieldValidationError(AppFieldValidationErrors.tildato_merEnnTreÅr);
    }

    if (hasValue(fraDato)) {
        if (moment(tilDato).isBefore(fraDato)) {
            return createAppFieldValidationError(AppFieldValidationErrors.tildato_erFørFradato);
        }
    }

    if (dateErHelg(tilDato)) {
        return createFieldValidationError(AppFieldValidationErrors.er_helg);
    }

    return undefined;
};

export const validateTextarea1000 = (text: string): FieldValidationResult => {
    if (text && text.length > 1000) {
        return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
    }
    return undefined;
};

export const validateFrilanserStartdato = (datoString?: string): FieldValidationResult => {
    if (!hasValue(datoString)) {
        return fieldIsRequiredError();
    }
    const dato = datepickerUtils.getDateFromDateString(datoString);

    if (!dato || moment(dato).isAfter(dateToday, 'day')) {
        return createAppFieldValidationError(AppFieldValidationErrors.frilanser_startdatoForSent);
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

export const dateErHelg = (date: Date) => dayjs(date).isoWeekday() === 6 || dayjs(date).isoWeekday() === 7;
