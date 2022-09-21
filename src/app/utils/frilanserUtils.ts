import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { Arbeidsgiver } from '../types';
import { FrilansFormData } from '../types/FrilansFormData';

export const FRILANS_MINIMIUM_NORMALARBEIDSTID = 1;

export const harFrilansoppdrag = (frilansoppdrag: Arbeidsgiver[] | undefined) =>
    frilansoppdrag !== undefined && frilansoppdrag.length >= 1;

export const erFrilanserITidsrom = (tidsrom: DateRange, frilansStartdato: Date, frilansSluttdato?: Date): boolean => {
    if (dayjs(frilansStartdato).isAfter(tidsrom.to, 'day')) {
        return false;
    }
    if (frilansSluttdato && dayjs(frilansSluttdato).isBefore(tidsrom.from, 'day')) {
        return false;
    }
    return true;
};

/**
 * Returnerer true dersom bruker har frilansoppdrag eller om en har svart at en er frilanser i perioden
 * @param søknadsperiode
 * @param values
 * @param frilansoppdrag
 * @returns
 */
export const erFrilanserISøknadsperiode = (
    søknadsperiode: DateRange,
    values: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[]
): boolean => {
    return harSvartErFrilanserISøknadsperioden(søknadsperiode, values) || harFrilansoppdrag(frilansoppdrag);
};

/**
 * Returnerer true dersom søker har svart at hen er frilanser og startdato/sluttdato er innenfor søknadsperioden.
 * @param søknadsperiode
 * @param formData
 * @returns boolean
 */
export const harSvartErFrilanserISøknadsperioden = (
    søknadsperiode: DateRange,
    { erFrilanserIPerioden, erFortsattFrilanser, sluttdato, startdato }: FrilansFormData
): boolean => {
    if (erFortsattFrilanser === YesOrNo.YES) {
        return true;
    }
    const frilansStartdato = datepickerUtils.getDateFromDateString(startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(sluttdato);

    if (frilansStartdato && erFrilanserIPerioden === YesOrNo.YES) {
        return erFrilanserITidsrom(søknadsperiode, frilansStartdato, frilansSluttdato);
    }
    return false;
};

export const skalBrukerOppgiArbeidstidSomFrilanser = (
    søknadsperiode: DateRange,
    frilansFormData: FrilansFormData
): boolean => {
    if (frilansFormData.erFrilanserIPerioden === YesOrNo.NO) {
        return false;
    }
    if (
        frilansFormData.fosterhjemsgodtgjørelse_mottar === YesOrNo.YES &&
        frilansFormData.fosterhjemsgodtgjørelse_harFlereOppdrag === YesOrNo.NO
    ) {
        return false;
    }
    const timerISnittPerUke = getNumberFromNumberInputValue(
        frilansFormData.arbeidsforhold?.normalarbeidstid?.timerPerUke
    );
    if (timerISnittPerUke !== undefined && timerISnittPerUke < FRILANS_MINIMIUM_NORMALARBEIDSTID) {
        return false;
    }
    return true;
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
 * medfører at bruker ikke er frilanser i perioden
 */

export const getGyldigPeriodeSomFrilanserInnenforPeriode = (
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
