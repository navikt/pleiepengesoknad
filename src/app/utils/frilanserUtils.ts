import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import {
    ArbeidsforholdFrilanserMedOppdragFormValues,
    ArbeidsforholdFrilanserNyFormValues,
} from '../types/ArbeidsforholdFormValues';
import dayjs from 'dayjs';
import { FrilansFormData, FrilansOppdragKategori, FrilansOppdragSvar, YesOrNoRadio } from '../types/FrilansFormData';

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
        oppdrag.frilansOppdragIPerioden === FrilansOppdragSvar.JA ||
        oppdrag.frilansOppdragIPerioden === FrilansOppdragSvar.JAAVSLUTESIPERIODEN;
    const harStyremedlemHeleInntekt =
        oppdrag.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV &&
        oppdrag.styremedlemHeleInntekt === YesOrNoRadio.JA;

    return (
        harFrilansOppdragIPerioden &&
        !harStyremedlemHeleInntekt &&
        oppdrag.frilansOppdragKategori !== FrilansOppdragKategori.FOSTERFORELDER &&
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
    oppdrag: ArbeidsforholdFrilanserNyFormValues,
    søknadsperiode: DateRange,
    erFrilanserIPeriode?: YesOrNo
): boolean => {
    if (erFrilanserIPeriode === YesOrNo.NO) {
        return false;
    }
    const frilansStartdato = datepickerUtils.getDateFromDateString(oppdrag.startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(oppdrag.sluttdato);

    if (frilansStartdato === undefined) {
        return false;
    }

    const harStyremedlemHeleInntekt =
        oppdrag.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV &&
        oppdrag.styremedlemHeleInntekt === YesOrNoRadio.JA;

    return (
        !harStyremedlemHeleInntekt &&
        oppdrag.frilansOppdragKategori !== FrilansOppdragKategori.FOSTERFORELDER &&
        erFrilanserITidsrom(søknadsperiode, frilansStartdato, frilansSluttdato)
    );
};

export const nyFrlilansOppdragISøknadsperiode = (
    arbeidsforhold: ArbeidsforholdFrilanserNyFormValues[],
    søknadsperiode: DateRange,
    erFrilanserIPeriode?: YesOrNo
): boolean => {
    return arbeidsforhold.some((oppdrag) =>
        harNyFrlilansOppdragISøknadsperiode(oppdrag, søknadsperiode, erFrilanserIPeriode)
    );
};

export const erFrilanserISøknadsperiode = (
    søknadsperiode: DateRange,
    { harHattInntektSomFrilanser, erFortsattFrilanser, sluttdato, startdato }: FrilansFormData
): boolean => {
    if (erFortsattFrilanser === YesOrNo.YES) {
        return true;
    }
    // TO DO FRILANS MED OPPDRAG
    const frilansStartdato = datepickerUtils.getDateFromDateString(startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(sluttdato);

    if (frilansStartdato && harSvartErFrilanserEllerHarFrilansoppdrag(harHattInntektSomFrilanser)) {
        return erFrilanserITidsrom(søknadsperiode, frilansStartdato, frilansSluttdato);
    }
    return false;
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
