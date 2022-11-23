import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, OpenDateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { ArbeidsforholdFrilansoppdragFormValues } from '../types/ArbeidsforholdFormValues';
import dayjs from 'dayjs';
import { FrilansoppdragType } from '../types/FrilansoppdragFormData';
import { FrilansoppdragIPeriodenApi } from '../types/søknad-api-data/frilansoppdragApiData';

export const harRegistrerteFrilansoppdrag = (frilansoppdrag: ArbeidsforholdFrilansoppdragFormValues[] | undefined) =>
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

export const harFrlilansoppdragISøknadsperiode = (
    oppdrag: ArbeidsforholdFrilansoppdragFormValues,
    søknadsperiode: DateRange
): boolean => {
    if (oppdrag.arbeidsgiver.ansattFom === undefined) {
        return false;
    }
    const frilansSluttdato = datepickerUtils.getDateFromDateString(oppdrag.sluttdato);

    const harFrilansoppdragIPerioden =
        oppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA ||
        oppdrag.frilansoppdragIPerioden === FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN;
    const harStyremedlemHeleInntekt =
        oppdrag.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV &&
        oppdrag.styremedlemHeleInntekt === YesOrNo.YES;

    return (
        harFrilansoppdragIPerioden &&
        !harStyremedlemHeleInntekt &&
        oppdrag.frilansoppdragKategori !== FrilansoppdragType.FOSTERFORELDER &&
        erFrilanserITidsrom(søknadsperiode, oppdrag.arbeidsgiver.ansattFom, frilansSluttdato)
    );
};

export const frlilansoppdragISøknadsperiode = (
    arbeidsforhold: ArbeidsforholdFrilansoppdragFormValues[],
    søknadsperiode: DateRange
): boolean => {
    return arbeidsforhold.some((oppdrag) => harFrlilansoppdragISøknadsperiode(oppdrag, søknadsperiode));
};

export const harNyttFrlilansoppdragISøknadsperiode = (
    oppdrag: ArbeidsforholdFrilansoppdragFormValues,
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
        oppdrag.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV &&
        oppdrag.styremedlemHeleInntekt === YesOrNo.YES;

    return (
        !harStyremedlemHeleInntekt &&
        oppdrag.frilansoppdragKategori !== FrilansoppdragType.FOSTERFORELDER &&
        erFrilanserITidsrom(søknadsperiode, frilansStartdato, frilansSluttdato)
    );
};

export const nyttFrlilansoppdragISøknadsperiode = (
    arbeidsforhold: ArbeidsforholdFrilansoppdragFormValues[],
    søknadsperiode: DateRange,
    erFrilanserIPeriode?: YesOrNo
): boolean => {
    return arbeidsforhold.some((oppdrag) =>
        harNyttFrlilansoppdragISøknadsperiode(oppdrag, søknadsperiode, erFrilanserIPeriode)
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
    { from, to }: OpenDateRange
): DateRange | undefined => {
    if (erFrilanserITidsrom(søknadsperiode, from, to) === false) {
        return undefined;
    }
    const fromDate: Date = dayjs.max([dayjs(søknadsperiode.from), dayjs(from)]).toDate();
    const toDate: Date = to ? dayjs.min([dayjs(søknadsperiode.to), dayjs(to)]).toDate() : søknadsperiode.to;

    return {
        from: fromDate,
        to: toDate,
    };
};
