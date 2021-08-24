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
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../config/minMaxValues';
import {
    ArbeidsforholdAnsatt,
    ArbeidsforholdSNF,
    FrilansEllerSelvstendig,
    isArbeidsforholdAnsatt,
    Omsorgstilbud,
} from '../types/PleiepengesøknadFormData';
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

export const getMinDate = (date1: Date, date2?: Date) => {
    if (!date2) return date1;
    if (dayjs(date1).isSame(date2)) return date1;
    return dayjs(date1).isBefore(dayjs(date2)) ? date2 : date1;
};
export const date1YearFromDateStrting = (dateString: string): Date =>
    dayjs(dateString).add(1, 'year').endOf('day').toDate();

export const validateFradato = (
    fraDatoString?: string,
    tilDatoString?: string,
    eldsteBarnFodselsdato?: Date
): ValidationResult<ValidationError> => {
    const tilDato = datepickerUtils.getDateFromDateString(tilDatoString);
    const minDate = getMinDate(date3YearsAgo, eldsteBarnFodselsdato);

    const error = getDateRangeValidator({
        required: true,
        min: minDate,
        toDate: tilDato,
        onlyWeekdays: true,
    }).validateFromDate(fraDatoString);
    return error
        ? {
              key:
                  error === 'dateIsBeforeMin' && !dayjs(date3YearsAgo).isSame(minDate)
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

export const validateSkalHaTilsynsordning = (tilsynsordning: Omsorgstilbud): ValidationResult<ValidationError> => {
    if (tilsynsordning.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (tilsynsordning.ja === undefined) {
            return AppFieldValidationErrors.tilsynsordning_ingenInfo;
        }
        const tilsyn = tilsynsordning.ja.fasteDager;

        const hoursInTotal = tilsyn ? sumTimerMedTilsyn(tilsyn) : 0;
        if (hoursInTotal === 0) {
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
        const error = time
            ? getTimeValidator({ max: { hours: 7, minutes: 30 }, min: { hours: 0, minutes: 0 } })(time)
            : undefined;
        if (error) {
            return {
                key: `validation.omsorgstilbud.ja.fastDag.tid.${error}`,
                values: { dag },
                keepKeyUnaltered: true,
            };
        }
        return undefined;
    };

export const getArbeidsformAnsattValidator =
    (arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF | undefined) => (value: any) => {
        if (arbeidsforhold === undefined) {
            return undefined;
        }
        const error = getRequiredFieldValidator()(value);
        if (error) {
            return isArbeidsforholdAnsatt(arbeidsforhold)
                ? {
                      key: 'validation.arbeidsforhold.arbeidsform.yesOrNoIsUnanswered',
                      values: { navn: arbeidsforhold.navn },
                      keepKeyUnaltered: true,
                  }
                : error;
        }
    };

export const getJobberNormaltTimerValidator =
    (
        arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF | undefined,
        frilansEllerSelvstendig?: FrilansEllerSelvstendig
    ) =>
    (value: any) => {
        if (arbeidsforhold === undefined) {
            return undefined;
        }
        const error = getNumberValidator({
            required: true,
            min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
            max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
        })(value);
        if (error) {
            return isArbeidsforholdAnsatt(arbeidsforhold)
                ? {
                      key: `validation.arbeidsforhold.jobberNormaltTimer.${arbeidsforhold.arbeidsform}.${error}`,
                      values: {
                          navn: arbeidsforhold.navn,
                          min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                          max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                      },
                      keepKeyUnaltered: true,
                  }
                : {
                      key: `validation.${frilansEllerSelvstendig}_arbeidsforhold.jobberNormaltTimer.${arbeidsforhold.arbeidsform}.${error}`,
                      values: {
                          min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                          max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                      },
                      keepKeyUnaltered: true,
                  };
        }
        return undefined;
    };

export const getArbeidsforholdSkalJobbeValidator =
    (arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF) => (value: any) => {
        const error = getRequiredFieldValidator()(value);
        if (error) {
            return isArbeidsforholdAnsatt(arbeidsforhold)
                ? {
                      key: 'validation.arbeidsforhold.skalJobbe',
                      values: { navn: arbeidsforhold.navn },
                      keepKeyUnaltered: true,
                  }
                : error;
        }
    };

export const getArbeidsforholdSkalJobbeHvorMyeValidator =
    (arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF) => (value: any) => {
        const error = getRequiredFieldValidator()(value);
        if (error) {
            return isArbeidsforholdAnsatt(arbeidsforhold)
                ? {
                      key: 'validation.arbeidsforhold.jobbeHvorMye',
                      values: { navn: arbeidsforhold.navn },
                      keepKeyUnaltered: true,
                  }
                : error;
        }
    };

export const getArbeidsforholdTimerEllerProsentValidator =
    (arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF) => (value: any) => {
        const error = getRequiredFieldValidator()(value);
        if (error) {
            return isArbeidsforholdAnsatt(arbeidsforhold)
                ? {
                      key: 'validation.arbeidsforhold.timerEllerProsent',
                      values: { navn: arbeidsforhold.navn },
                      keepKeyUnaltered: true,
                  }
                : error;
        }
    };

export const getArbeidsforholdSkalJobbeTimerValidator =
    (arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF) => (value: any) => {
        const jobberNormaltTimerNumber = getNumberFromNumberInputValue(arbeidsforhold.jobberNormaltTimer);
        if (!jobberNormaltTimerNumber) {
            return undefined;
        }
        const error = validateReduserteArbeidTimer(value, jobberNormaltTimerNumber);
        if (error) {
            return isArbeidsforholdAnsatt(arbeidsforhold)
                ? {
                      key: `validation.arbeidsforhold.skalJobbeTimer.${error}`,
                      values: { navn: arbeidsforhold.navn },
                      keepKeyUnaltered: true,
                  }
                : error;
        }
    };

export const getArbeidsforholdSkalJobbeProsentValidator =
    (arbeidsforhold: ArbeidsforholdAnsatt | ArbeidsforholdSNF) => (value) => {
        const error = getNumberValidator({
            required: true,
            min: 1,
            max: 99,
        })(value);
        if (error) {
            return isArbeidsforholdAnsatt(arbeidsforhold)
                ? {
                      key: `validation.arbeidsforhold.skalJobbeProsent.${error}`,
                      values: { navn: arbeidsforhold.navn },
                      keepKeyUnaltered: true,
                  }
                : error;
        }
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
