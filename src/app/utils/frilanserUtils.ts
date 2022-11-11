import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../types/ArbeidsforholdFormValues';
import dayjs from 'dayjs';
import { FrilanserOppdragType } from '../types/FrilansFormData';
import { FrilanserOppdragIPeriodenApi } from '../types/søknad-api-data/frilansOppdragApiData';

export const harFrilansoppdrag = (frilansoppdrag: ArbeidsforholdFrilanserMedOppdragFormValues[] | undefined) =>
    // TODO legg till mer varianter
    frilansoppdrag !== undefined && frilansoppdrag.length > 0;

export const harSvartErFrilanserEllerHarFrilansoppdrag = (harHattInntektSomFrilanser: YesOrNo | undefined): boolean => {
    return harHattInntektSomFrilanser === YesOrNo.YES;
};

export const erFrilanserITidsrom = (tidsrom: DateRange, frilansStartdato: Date, frilansSluttdato?: Date): boolean => {
    if (dayjs(frilansStartdato).isAfter(tidsrom.to, 'day')) {
        return false;
    }
    if (frilansSluttdato && dayjs(frilansSluttdato).isBefore(tidsrom.from, 'day')) {
        return false;
    }
    return true;
};

export const harFrlilansOppdragISøknadsperiode = (
    oppdrag: ArbeidsforholdFrilanserMedOppdragFormValues,
    søknadsperiode: DateRange
): boolean => {
    if (oppdrag.arbeidsgiver.ansattFom === undefined) {
        return false;
    }
    const frilansSluttdato = datepickerUtils.getDateFromDateString(oppdrag.sluttdato);

    const harFrilansOppdragIPerioden =
        oppdrag.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA ||
        oppdrag.frilansOppdragIPerioden === FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN;
    const harStyremedlemHeleInntekt =
        oppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
        oppdrag.styremedlemHeleInntekt === YesOrNo.YES;

    return (
        harFrilansOppdragIPerioden &&
        !harStyremedlemHeleInntekt &&
        oppdrag.frilansOppdragKategori !== FrilanserOppdragType.FOSTERFORELDER &&
        erFrilanserITidsrom(søknadsperiode, oppdrag.arbeidsgiver.ansattFom, frilansSluttdato)
    );
};

export const frlilansOppdragISøknadsperiode = (
    arbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues[],
    søknadsperiode: DateRange
): boolean => {
    return arbeidsforhold.some((oppdrag) => harFrlilansOppdragISøknadsperiode(oppdrag, søknadsperiode));
};

export const harNyFrlilansOppdragISøknadsperiode = (
    oppdrag: ArbeidsforholdFrilanserMedOppdragFormValues,
    søknadsperiode: DateRange,
    erFrilanserIPeriode?: YesOrNo
): boolean => {
    if (erFrilanserIPeriode === YesOrNo.NO) {
        return false;
    }

    const frilansStartdato = oppdrag.arbeidsgiver.ansattFom;
    const frilansSluttdato = oppdrag.arbeidsgiver.ansattTom;

    if (frilansStartdato === undefined) {
        return false;
    }

    const harStyremedlemHeleInntekt =
        oppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
        oppdrag.styremedlemHeleInntekt === YesOrNo.YES;

    return (
        !harStyremedlemHeleInntekt &&
        oppdrag.frilansOppdragKategori !== FrilanserOppdragType.FOSTERFORELDER &&
        erFrilanserITidsrom(søknadsperiode, frilansStartdato, frilansSluttdato)
    );
};

export const nyFrlilansOppdragISøknadsperiode = (
    arbeidsforhold: ArbeidsforholdFrilanserMedOppdragFormValues[],
    søknadsperiode: DateRange,
    erFrilanserIPeriode?: YesOrNo
): boolean => {
    return arbeidsforhold.some((oppdrag) =>
        harNyFrlilansOppdragISøknadsperiode(oppdrag, søknadsperiode, erFrilanserIPeriode)
    );
};

/**
 *
 * @param periode
 * @param startdato
 * @param sluttdato
 * @param erFortsattFrilanser
 * @returns DateRange
 *
 * Avkort periode med evt start og sluttdato som frilanser.
 * Returnerer undefined dersom start og/eller slutt som frilanser
 * gjør at bruker ikke var frilanser i perioden
 */
/*
export const getPeriodeSomFrilanserInnenforPeriode = (
    periode: DateRange,
    { startdato, sluttdato, erFortsattFrilanser }: FrilansFormData
): DateRange | undefined => {
    const frilansStartdato = datepickerUtils.getDateFromDateString(startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(sluttdato);

    if (frilansStartdato === undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Startdato ikke satt');
        return undefined;
    }
    if (erFortsattFrilanser === YesOrNo.YES && sluttdato !== undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Jobber fortsatt som frilanser, men sluttdato er satt');
        return undefined;
    }
    if (erFortsattFrilanser === YesOrNo.NO && !frilansSluttdato) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Er ikke frilanser, men sluttdato er ikke satt');
        return undefined;
    }

    if (erFrilanserITidsrom(periode, frilansStartdato, frilansSluttdato) === false) {
        return undefined;
    }

    const fromDate: Date = dayjs.max([dayjs(periode.from), dayjs(frilansStartdato)]).toDate();
    const toDate: Date = frilansSluttdato
        ? dayjs.min([dayjs(periode.to), dayjs(frilansSluttdato)]).toDate()
        : periode.to;

    return {
        from: fromDate,
        to: toDate,
    };
};
*/
export const getPeriodeSomFrilanserInnenforSøknadsperiode = (
    søknadsperiode: DateRange,
    startdato: Date,
    sluttdato?: Date
): DateRange | undefined => {
    if (erFrilanserITidsrom(søknadsperiode, startdato, sluttdato) === false) {
        return undefined;
    }
    const fromDate: Date = dayjs.max([dayjs(søknadsperiode.from), dayjs(startdato)]).toDate();
    const toDate: Date = sluttdato
        ? dayjs.min([dayjs(søknadsperiode.to), dayjs(sluttdato)]).toDate()
        : søknadsperiode.to;

    return {
        from: fromDate,
        to: toDate,
    };
};
