import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
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
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    getDateRangeValidator,
    getFødselsnummerValidator,
    getStringValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import { durationToDecimalDuration, DateDurationMap } from '@navikt/sif-common-utils';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import { getDurationsInDateRange, getValidDurations, summarizeDateDurationMap } from '@navikt/sif-common-utils';

dayjs.extend(minMax);
dayjs.extend(isoWeek);

export enum AppFieldValidationErrors {
    'samlet_storrelse_for_hoy' = 'validation.samlet_storrelse_for_hoy',
    'legeerklæring_mangler' = 'legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'legeerklæring.forMangeFiler',

    'arbeidsforhold_timerUgyldig_under_1_prosent' = 'timerUgyldig_under_1_prosent',
    'arbeidsforhold_timerUgyldig_under_0_prosent' = 'timerUgyldig_under_0_prosent',
    'arbeidsforhold_timerUgyldig_over_99_prosent' = 'timerUgyldig_over_99_prosent',
    'arbeidsforhold_timerUgyldig_over_100_prosent' = 'timerUgyldig_over_100_prosent',

    'omsorgstilbud_gruppe_ingenInfo' = 'ingenInfo',
    'omsorgstilbud_gruppe_forMangeTimerTotalt' = 'forMangeTimerTotalt',

    'utenlandsopphold_ikke_registrert' = 'utenlandsopphold_ikke_registrert',
    'utenlandsopphold_overlapper' = 'utenlandsopphold_overlapper',
    'utenlandsopphold_overlapper_samme_start_slutt' = 'utenlandsopphold_overlapper_samme_start_slutt',
    'utenlandsopphold_utenfor_periode' = 'utenlandsopphold_utenfor_periode',
    'ferieuttak_ikke_registrert' = 'ferieuttak_ikke_registrert',
    'ferieuttak_overlapper' = 'ferieuttak_overlapper',
    'ferieuttak_utenfor_periode' = 'ferieuttak_utenfor_periode',
}

export const isYesOrNoAnswered = (answer?: YesOrNo) => {
    return answer !== undefined && (answer === YesOrNo.NO || answer === YesOrNo.YES || answer === YesOrNo.DO_NOT_KNOW);
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

export const validateFradato = (
    fraDatoString?: string,
    tilDatoString?: string,
    eldsteBarnFodselsdato?: Date
): ValidationResult<ValidationError> => {
    const tilDato = datepickerUtils.getDateFromDateString(tilDatoString);
    const minDate = eldsteBarnFodselsdato
        ? dayjs.max(dayjs(date3YearsAgo).endOf('day'), dayjs(eldsteBarnFodselsdato).endOf('day')).toDate()
        : date3YearsAgo;

    const error = getDateRangeValidator({
        required: true,
        min: minDate,
        toDate: tilDato,
        onlyWeekdays: false,
    }).validateFromDate(fraDatoString);
    return error
        ? {
              key:
                  error === 'dateIsBeforeMin' && !dayjs(date3YearsAgo).isSame(minDate, 'day')
                      ? `${error}.${'fødselsdato'}`
                      : error,
          }
        : undefined;
};

export const validateTildato = (tilDatoString?: string, fraDatoString?: string): ValidationResult<ValidationError> => {
    return getDateRangeValidator({
        required: true,
        min: date3YearsAgo,
        max: fraDatoString ? dayjs(fraDatoString).endOf('day').add(1, 'year').toDate() : undefined,
        fromDate: datepickerUtils.getDateFromDateString(fraDatoString),
        onlyWeekdays: false,
    }).validateToDate(tilDatoString);
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

export const validateOmsorgstilbudEnkeltdagerIPeriode = (tidIOmsorgstilbud: DateDurationMap, periode: DateRange) => {
    const tidIPerioden = getDurationsInDateRange(tidIOmsorgstilbud, periode);
    const validTidEnkeltdager = getValidDurations(tidIPerioden);
    const hasElements = Object.keys(validTidEnkeltdager).length > 0;

    if (!hasElements || durationToDecimalDuration(summarizeDateDurationMap(validTidEnkeltdager)) <= 0) {
        return 'ingenTidRegistrert';
    }
    return undefined;
};
