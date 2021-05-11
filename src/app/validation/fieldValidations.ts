import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { Time } from '@navikt/sif-common-core/lib/types/Time';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import {
    attachmentHasBeenUploaded,
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import {
    date3YearsAgo,
    DateRange,
    dateRangesCollide,
    dateRangesExceedsRange,
    dateRangesHasFromDateEqualPreviousRangeToDate,
    dateToday,
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToDecimalTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    getDateRangeValidator,
    getDateValidator,
    getFødselsnummerValidator,
    getNumberValidator,
    getStringValidator,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Tilsynsordning } from '../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../utils/arbeidsforholdUtils';
import { sumTimerMedTilsyn } from '../utils/tilsynUtils';

dayjs.extend(isoWeek);

export enum AppFieldValidationErrors {
    'samlet_storrelse_for_hoy' = 'validation.samlet_storrelse_for_hoy',
    'legeerklæring_mangler' = 'legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'legeerklæring.forMangeFiler',

    'arbeidsforhold_timerUgyldig_under_1_prosent' = 'timerUgyldig_under_1_prosent',
    'arbeidsforhold_timerUgyldig_over_99_prosent' = 'timerUgyldig_over_99_prosent',

    'tilsynsordning_ingenInfo' = 'tilsynsordning_ingenInfo',
    'tilsynsordning_forMangeTimerTotalt' = 'tilsynsordning_forMangeTimerTotalt',
    'tilsynsordning_forMangeTimerEnDag' = 'tilsynsordning_forMangeTimerEnDag',
    'tilsynsordning_forMangeTegn' = 'tilsynsordning_forMangeTegn',

    'utenlandsopphold_ikke_registrert' = 'utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'utenlandsopphold_overlapper',
    'utenlandsopphold_overlapper_samme_start_slutt' = 'utenlandsopphold_overlapper_samme_start_slutt',
    'utenlandsopphold_utenfor_periode' = 'utenlandsopphold_utenfor_periode',
    'ferieuttak_ikke_registrert' = 'ferieuttak_ikke_registrert',
    'ferieuttak_overlapper' = 'ferieuttak_overlapper',
    'ferieuttak_utenfor_periode' = 'ferieuttak_utenfor_periode',
}

export const isYesOrNoAnswered = (answer: YesOrNo) => {
    return answer === YesOrNo.NO || answer === YesOrNo.YES || answer === YesOrNo.DO_NOT_KNOW;
};

export const validateFødselsdato = (dateString?: string): ValidationResult<ValidationError> => {
    return getDateValidator({ required: true, max: dateToday })(dateString);
};

export const validateNavn = (value: string): ValidationResult<ValidationError> => {
    const error = getStringValidator({ required: true, maxLength: 50 })(value);
    return error
        ? {
              key: error,
              values: { maks: 50 },
          }
        : undefined;
};

export const validateFødselsnummer = (value: string): ValidationResult<ValidationError> => {
    return getFødselsnummerValidator({ required: true })(value);
};

export const validateFradato = (fraDatoString?: string, tilDatoString?: string): ValidationResult<ValidationError> => {
    const tilDato = datepickerUtils.getDateFromDateString(tilDatoString);
    return getDateRangeValidator({
        required: true,
        min: date3YearsAgo,
        toDate: tilDato,
        onlyWeekdays: true,
    }).validateFromDate(fraDatoString);
};

export const validateTildato = (tilDatoString?: string, fraDatoString?: string): ValidationResult<ValidationError> => {
    return getDateRangeValidator({
        required: true,
        min: date3YearsAgo,
        fromDate: datepickerUtils.getDateFromDateString(fraDatoString),
        onlyWeekdays: true,
    }).validateToDate(tilDatoString);
};

export const validateFrilanserStartdato = (datoString?: string): ValidationResult<ValidationError> => {
    return getDateValidator({ required: true, max: dateToday })(datoString);
};

export const validateUtenlandsoppholdIPerioden = (
    periode: DateRange,
    utenlandsopphold: Utenlandsopphold[]
): ValidationResult<ValidationError> => {
    if (utenlandsopphold.length === 0) {
        return AppFieldValidationErrors.utenlandsopphold_ikke_registrert;
    }
    const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return AppFieldValidationErrors.utenlandsopphold_overlapper;
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return AppFieldValidationErrors.utenlandsopphold_utenfor_periode;
    }
    if (dateRangesHasFromDateEqualPreviousRangeToDate(dateRanges)) {
        return AppFieldValidationErrors.utenlandsopphold_overlapper_samme_start_slutt;
    }
    return undefined;
};

export const validateFerieuttakIPerioden = (
    periode: DateRange,
    ferieuttak: Ferieuttak[]
): ValidationResult<ValidationError> => {
    if (ferieuttak.length === 0) {
        return AppFieldValidationErrors.ferieuttak_ikke_registrert;
    }
    const dateRanges = ferieuttak.map((u) => ({ from: u.fom, to: u.tom }));
    if (dateRangesCollide(dateRanges)) {
        return AppFieldValidationErrors.ferieuttak_overlapper;
    }
    if (dateRangesExceedsRange(dateRanges, periode)) {
        return AppFieldValidationErrors.ferieuttak_utenfor_periode;
    }
    return undefined;
};

export const validateLegeerklæring = (attachments: Attachment[]): ValidationResult<ValidationError> => {
    const uploadedAttachments = attachments.filter((attachment) => attachmentHasBeenUploaded(attachment));
    const totalSizeInBytes: number = getTotalSizeOfAttachments(attachments);
    if (totalSizeInBytes > MAX_TOTAL_ATTACHMENT_SIZE_BYTES) {
        return AppFieldValidationErrors.samlet_storrelse_for_hoy;
    }
    if (uploadedAttachments.length > 100) {
        return AppFieldValidationErrors.legeerklæring_forMangeFiler;
    }
    return undefined;
};

export const validateSkalHaTilsynsordning = (tilsynsordning: Tilsynsordning): ValidationResult<ValidationError> => {
    if (tilsynsordning.skalBarnHaTilsyn === YesOrNo.YES) {
        if (tilsynsordning.ja === undefined) {
            return AppFieldValidationErrors.tilsynsordning_ingenInfo;
        }
        const { ekstrainfo, tilsyn } = tilsynsordning.ja;
        const hasEkstrainformasjon: boolean = (ekstrainfo || '').trim().length > 5;
        const hoursInTotal = tilsyn ? sumTimerMedTilsyn(tilsyn) : 0;
        if (hoursInTotal === 0 && hasEkstrainformasjon === false) {
            return AppFieldValidationErrors.tilsynsordning_ingenInfo;
        }
        if (hoursInTotal > 37.5) {
            return AppFieldValidationErrors.tilsynsordning_forMangeTimerTotalt;
        }
    }
    return undefined;
};

export const getTilsynstimerValidatorEnDag =
    (dag: string) =>
    (time: Time): ValidationResult<ValidationError> => {
        if (time && timeToDecimalTime(time) > 7.5) {
            return {
                key: `validation.tilsynsordning.tilsynsordning_forMangeTimerEnDag`,
                values: { dag },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const validateReduserteArbeidTimer = (value: string, jobberNormaltTimer: number): string | undefined => {
    const numberError = getNumberValidator({ required: true })(value);
    const skalJobbeTimer = getNumberFromNumberInputValue(value);
    if (numberError) {
        return numberError;
    }
    if (skalJobbeTimer === undefined) {
        return ValidateRequiredFieldError.noValue;
    }
    const pst = calcRedusertProsentFromRedusertTimer(jobberNormaltTimer, skalJobbeTimer);
    if (pst < 1) {
        return AppFieldValidationErrors.arbeidsforhold_timerUgyldig_under_1_prosent;
    }
    if (pst > 99) {
        return AppFieldValidationErrors.arbeidsforhold_timerUgyldig_over_99_prosent;
    }
    return undefined;
};
