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
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    getDateRangeValidator,
    getDateValidator,
    getFødselsnummerValidator,
    getNumberValidator,
    getRequiredFieldValidator,
    getStringValidator,
    ValidateRequiredFieldError,
} from '@navikt/sif-common-formik/lib/validation';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { Utenlandsopphold } from '@navikt/sif-common-forms/lib';
import { Ferieuttak } from '@navikt/sif-common-forms/lib/ferieuttak/types';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import minMax from 'dayjs/plugin/minMax';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import { ArbeidsforholdAnsatt, Omsorgstilbud } from '../types/PleiepengesøknadFormData';
import { calcRedusertProsentFromRedusertTimer } from '../utils/arbeidsforholdUtils';
import { sumTimerMedOmsorgstilbud } from '../utils/omsorgstilbudUtils';

dayjs.extend(minMax);
dayjs.extend(isoWeek);

export enum AppFieldValidationErrors {
    'samlet_storrelse_for_hoy' = 'validation.samlet_storrelse_for_hoy',
    'legeerklæring_mangler' = 'legeerklæring.mangler',
    'legeerklæring_forMangeFiler' = 'legeerklæring.forMangeFiler',

    'arbeidsforhold_timerUgyldig_under_1_prosent' = 'timerUgyldig_under_1_prosent',
    'arbeidsforhold_timerUgyldig_over_99_prosent' = 'timerUgyldig_over_99_prosent',

    'omsorgstilbud_ingenInfo' = 'omsorgstilbud_ingenInfo',
    'omsorgstilbud_forMangeTimerTotalt' = 'omsorgstilbud_forMangeTimerTotalt',
    'omsorgstilbud_forMangeTimerEnDag' = 'omsorgstilbud_forMangeTimerEnDag',
    'omsorgstilbud_forMangeTegn' = 'omsorgstilbud_forMangeTegn',

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

export const date1YearFromDateStrting = (dateString: string): Date => {
    return dayjs(dateString).endOf('day').add(1, 'year').toDate();
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
        onlyWeekdays: true,
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
        max: fraDatoString ? date1YearFromDateStrting(fraDatoString) : undefined,
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

export const validateSkalIOmsorgstilbud = (omsorgstilbud: Omsorgstilbud): ValidationResult<ValidationError> => {
    if (omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (omsorgstilbud.planlagt === undefined) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        const fasteDager = omsorgstilbud.planlagt.fasteDager;

        const hoursInTotal = fasteDager ? sumTimerMedOmsorgstilbud(fasteDager) : 0;
        if (hoursInTotal === 0) {
            return AppFieldValidationErrors.omsorgstilbud_ingenInfo;
        }
        if (hoursInTotal > 37.5) {
            return AppFieldValidationErrors.omsorgstilbud_forMangeTimerTotalt;
        }
    }
    return undefined;
};

export const getOmsorgstilbudtimerValidatorEnDag =
    (dag: string) =>
    (time: Time): ValidationResult<ValidationError> => {
        const error = time
            ? getTimeValidator({ max: { hours: 7, minutes: 30 }, min: { hours: 0, minutes: 0 } })(time)
            : undefined;
        if (error) {
            return {
                key: `validation.omsorgstilbud.planlagt.fastDag.tid.${error}`,
                values: { dag },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const getArbeidsformValidator = (intlValues: { hvor: string; jobber: string }) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidsforhold.arbeidsform.noValue',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
};

export const getJobberNormaltTimerValidator =
    (intlValues: { hvor: string; jobber: string; arbeidsform?: string }) => (value: any) => {
        if (!intlValues.arbeidsform) {
            return undefined;
        }
        const error = getNumberValidator({
            required: true,
            min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
            max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
        })(value);

        return error
            ? {
                  key: `validation.arbeidsforhold.jobberNormaltTimer.${error}`,
                  values: {
                      ...intlValues,
                      min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                      max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                  },
                  keepKeyUnaltered: true,
              }
            : undefined;
    };

export const getArbeidsforholdSluttdatoValidator =
    ({ maksDato, arbeidsforhold }: { maksDato: Date; arbeidsforhold: ArbeidsforholdAnsatt }) =>
    (value: any): ValidationError | undefined => {
        const error = getDateValidator({ required: true, max: maksDato })(value);
        return error
            ? {
                  key: `validation.arbeidsforhold.sluttdato.${error}`,
                  values: { navn: arbeidsforhold.navn },
                  keepKeyUnaltered: true,
              }
            : undefined;
    };

export const getArbeidsforholdSkalJobbeValidator =
    (intlValues: { hvor: string; skalJobbe: string }) => (value: any) => {
        const error = getRequiredFieldValidator()(value);
        return error
            ? {
                  key: 'validation.arbeidsforholdIPerioden.skalJobbe',
                  values: intlValues,
                  keepKeyUnaltered: true,
              }
            : error;
    };

export const getArbeidsforholdSkalJobbeHvorMyeValidator =
    (intlValues: { hvor: string; skalJobbe: string }) => (value: any) => {
        const error = getRequiredFieldValidator()(value);
        return error
            ? {
                  key: 'validation.arbeidsforholdIPerioden.jobbeHvorMye',
                  values: intlValues,
                  keepKeyUnaltered: true,
              }
            : undefined;
    };

export const getArbeidsforholdTimerEllerProsentValidator =
    (intlValues: { hvor: string; skalJobbe: string }) => (value: any) => {
        const error = getRequiredFieldValidator()(value);
        return error
            ? {
                  key: 'validation.arbeidsforholdIPerioden.timerEllerProsent',
                  values: intlValues,
                  keepKeyUnaltered: true,
              }
            : undefined;
    };

export const getArbeidsforholdSkalJobbeTimerValidator =
    (jobberNormaltTimerNumber: number, intlValues: { hvor: string; skalJobbe: string }) => (value: any) => {
        const error = validateReduserteArbeidTimer(value, jobberNormaltTimerNumber);
        return error
            ? {
                  key: `validation.arbeidsforholdIPerioden.skalJobbeTimer.${error}`,
                  values: intlValues,
                  keepKeyUnaltered: true,
              }
            : undefined;
    };

export const getArbeidsforholdSkalJobbeProsentValidator =
    (intlValues: { hvor: string; skalJobbe: string }) => (value: any) => {
        const error = getNumberValidator({
            required: true,
            min: 1,
            max: 99,
        })(value);
        return error
            ? {
                  key: `validation.arbeidsforholdIPerioden.skalJobbeProsent.${error}`,
                  values: intlValues,
                  keepKeyUnaltered: true,
              }
            : undefined;
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
