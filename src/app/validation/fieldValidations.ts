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
    getRequiredFieldValidator,
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
    'arbeidsforhold_prosentUgyldig' = 'fieldvalidation.arbeidsforhold_prosentUgyldig',
    'arbeidsforhold_redusertMerEnnNormalt' = 'fieldvalidation.arbeidsforhold_redusertMerEnnNormalt',
    'er_helg' = 'fieldvalidation.er_helg',
    'relasjon_forMangeTegn' = 'fieldvalidation.relasjon_forMangeTegn',
    'relasjon_forFåTegn' = 'fieldvalidation.relasjon_forFåTegn',
    'selvstendig_måRegistrereAlleSelskapene' = 'fieldvalidation.selvstendig.må_registrere_alle_selskapene',

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
    return getStringValidator({ required: true, maxLength: 50 })(value);
};

export const validateFødselsnummer = (value: string): ValidationResult<ValidationError> => {
    return getFødselsnummerValidator({ required: true })(value);
};
//     if (isRequired === true && !hasValue(v)) {
//         return fieldIsRequiredError();
//     }

//     const maxNumOfLetters = 50;
//     const nameIsValid = v.length <= maxNumOfLetters;

//     return nameIsValid
//         ? undefined
//         : createAppFieldValidationError(AppFieldValidationErrors.navn_maksAntallTegn, { maxNumOfLetters });
// };

export const validateFradato = (fraDatoString?: string, tilDatoString?: string): ValidationResult<ValidationError> => {
    const tilDato = datepickerUtils.getDateFromDateString(tilDatoString);
    return getDateRangeValidator({
        required: true,
        min: date3YearsAgo,
        toDate: tilDato,
        onlyWeekdays: true,
    }).validateFromDate(fraDatoString);

    // const fraDato = datepickerUtils.getDateFromDateString(fraDatoString);
    // if (!hasValue(fraDato)) {
    //     return fieldIsRequiredError();
    // }

    // if (!fraDato || isMoreThan3YearsAgo(fraDato)) {
    //     return createAppFieldValidationError(AppFieldValidationErrors.fradato_merEnnTreÅr);
    // }

    // if (hasValue(tilDato)) {
    //     if (moment(fraDato).isAfter(tilDato)) {
    //         return createAppFieldValidationError(AppFieldValidationErrors.fradato_erEtterTildato);
    //     }
    // }

    // if (dateErHelg(fraDato)) {
    //     return createFieldValidationError(AppFieldValidationErrors.er_helg);
    // }

    // return undefined;
};

export const validateTildato = (tilDatoString?: string, fraDatoString?: string): ValidationResult<ValidationError> => {
    return getDateRangeValidator({
        required: true,
        min: date3YearsAgo,
        fromDate: datepickerUtils.getDateFromDateString(fraDatoString),
        onlyWeekdays: true,
    }).validateToDate(tilDatoString);

    // const tilDato = datepickerUtils.getDateFromDateString(tilDatoString);

    // if (!hasValue(tilDato)) {
    //     return fieldIsRequiredError();
    // }

    // if (!tilDato || isMoreThan3YearsAgo(tilDato)) {
    //     return createAppFieldValidationError(AppFieldValidationErrors.tildato_merEnnTreÅr);
    // }

    // if (hasValue(fraDato)) {
    //     if (moment(tilDato).isBefore(fraDato)) {
    //         return createAppFieldValidationError(AppFieldValidationErrors.tildato_erFørFradato);
    //     }
    // }

    // if (dateErHelg(tilDato)) {
    //     return createFieldValidationError(AppFieldValidationErrors.er_helg);
    // }

    // return undefined;
};

// export const validateTextarea1000 = (text: string): ValidationResult<ValidationError> => {
//     if (text && text.length > 1000) {
//         return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
//     }
//     return undefined;
// };

export const validateFrilanserStartdato = (datoString?: string): ValidationResult<ValidationError> => {
    return getDateValidator({ required: true, max: dateToday })(datoString);
    // if (!hasValue(datoString)) {
    //     return fieldIsRequiredError();
    // }
    // const dato = datepickerUtils.getDateFromDateString(datoString);

    // if (!dato || moment(dato).isAfter(dateToday, 'day')) {
    //     return createAppFieldValidationError(AppFieldValidationErrors.frilanser_startdatoForSent);
    // }

    // return undefined;
};

// export const validateBekreftOmsorgEkstrainfo = (text: string): ValidationResult<ValidationError> => {
//     if (!hasValue(text)) {
//         return fieldIsRequiredError();
//     }
//     if (text && text.length > 1000) {
//         return createAppFieldValidationError(AppFieldValidationErrors.bekreftOmsorg_ekstrainfoForMangeTegn);
//     }
//     return undefined;
// };

// export const validateTilsynsordningTilleggsinfo = (text: string): ValidationResult<ValidationError> => {
//     if (text !== undefined && text.length > 1000) {
//         return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
//     }
//     return undefined;
// };

// export const validateRelasjonTilBarnetBeskrivelse = (text: string): ValidationResult<ValidationError> => {
//     if (!hasValue(text)) {
//         return fieldIsRequiredError();
//     }
//     if (text.length < 3) {
//         return createAppFieldValidationError(AppFieldValidationErrors.relasjon_forFåTegn);
//     }
//     if (text.length > 1000) {
//         return createAppFieldValidationError(AppFieldValidationErrors.relasjon_forMangeTegn);
//     }
//     return undefined;
// };

// export const validateNattevåkTilleggsinfo = (text: string): ValidationResult<ValidationError> => {
//     if (!hasValue(text)) {
//         return fieldIsRequiredError();
//     }
//     if (text.length > 1000) {
//         return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
//     }
//     return undefined;
// };

// export const validateBeredskapTilleggsinfo = (text: string): ValidationResult<ValidationError> => {
//     if (!hasValue(text)) {
//         return fieldIsRequiredError();
//     }
//     if (text.length > 1000) {
//         return createAppFieldValidationError(AppFieldValidationErrors.tilsynsordning_forMangeTegn);
//     }
//     return undefined;
// };

// export const validateUtenlandsoppholdSiste12Mnd = (
//     utenlandsopphold: Utenlandsopphold[]
// ): ValidationResult<ValidationError> => {
//     if (utenlandsopphold.length === 0) {
//         return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
//     }
//     const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
//     if (dateRangesCollide(dateRanges)) {
//         return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
//     }
//     if (dateRangesExceedsRange(dateRanges, { from: date1YearAgo, to: new Date() })) {
//         return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
//     }

//     return undefined;
// };

// export const validateUtenlandsoppholdNeste12Mnd = (
//     utenlandsopphold: Utenlandsopphold[]
// ): ValidationResult<ValidationError> => {
//     if (utenlandsopphold.length === 0) {
//         return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_ikke_registrert);
//     }
//     const dateRanges = utenlandsopphold.map((u) => ({ from: u.fom, to: u.tom }));
//     if (dateRangesCollide(dateRanges)) {
//         return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper);
//     }
//     if (dateRangesExceedsRange(dateRanges, { from: new Date(), to: date1YearFromNow })) {
//         return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_utenfor_periode);
//     }
//     if (dateRangesHasFromDateEqualPreviousRangeToDate(dateRanges)) {
//         return createAppFieldValidationError(AppFieldValidationErrors.utenlandsopphold_overlapper_samme_start_slutt);
//     }

//     return undefined;
// };

// export const validateNumberInputValue = ({ min, max }: { min?: number; max?: number }) => (
//     value: string
// ): ValidationResult<ValidationError> => {
//     const numValue = getNumberFromNumberInputValue(value);
//     if (numValue === undefined) {
//         return fieldIsRequiredError();
//     }
//     if (isNaN(numValue)) {
//         return createFieldValidationError(FieldValidationErrors.tall_ugyldig);
//     }
//     if (min !== undefined && max !== undefined) {
//         if (numValue < min || numValue > max) {
//             return createFieldValidationError(FieldValidationErrors.tall_ikke_innenfor_min_maks, { min, maks: max });
//         }
//     }
//     if (min !== undefined && numValue < min) {
//         return createFieldValidationError(FieldValidationErrors.tall_for_lavt, { min });
//     }
//     if (max !== undefined && numValue > max) {
//         return createFieldValidationError(FieldValidationErrors.tall_for_høyt, { maks: max });
//     }
//     return undefined;
// };

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

// export const validateErAnsattIPerioden = (
//     arbeidsforhold: Arbeidsforhold[],
//     orgnummer: string
// ): ValidationResult<ValidationError> => {
//     const forhold = arbeidsforhold.find((a) => a.organisasjonsnummer === orgnummer);
//     if (
//         forhold === undefined ||
//         forhold.erAnsattIPerioden === undefined ||
//         forhold.erAnsattIPerioden === YesOrNo.UNANSWERED
//     ) {
//         return fieldIsRequiredError();
//     }

//     return undefined;
// };

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

export const getTilsynstimerValidatorEnDag = (dag: string) => (time: Time): ValidationResult<ValidationError> => {
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
    const requiredError = getRequiredFieldValidator()(value);
    if (requiredError) {
        return requiredError;
    }
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

// export const validateSelvstendigHarLagtInnAlleSelskap = (answer: string): ValidationResult<ValidationError> => {
//     if (answer === YesOrNo.UNANSWERED || answer === undefined) {
//         return ValidateRequiredFieldError.noValue;
//     }
//     if (answer === YesOrNo.NO) {
//         return AppFieldValidationErrors.selvstendig_måRegistrereAlleSelskapene;
//     }
//     return undefined;
// };

// export const dateErHelg = (date: Date) => dayjs(date).isoWeekday() === 6 || dayjs(date).isoWeekday() === 7;
