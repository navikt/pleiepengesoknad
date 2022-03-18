import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { Arbeidsgiver } from '../types';
import { FrilansFormData } from '../types/FrilansFormData';

export const harFrilansoppdrag = (frilansoppdrag: Arbeidsgiver[] | undefined) =>
    frilansoppdrag !== undefined && frilansoppdrag.length > 0;

export const harSvartErFrilanserEllerHarFrilansoppdrag = (
    harHattInntektSomFrilanser: YesOrNo | undefined,
    frilansoppdrag: Arbeidsgiver[] | undefined
): boolean => {
    return harFrilansoppdrag(frilansoppdrag) || harHattInntektSomFrilanser === YesOrNo.YES;
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

export const erFrilanserISøknadsperiode = (
    søknadsperiode: DateRange,
    { harHattInntektSomFrilanser, jobberFortsattSomFrilans, sluttdato, startdato }: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[] | undefined
): boolean => {
    if (jobberFortsattSomFrilans === YesOrNo.YES) {
        return true;
    }
    const frilansStartdato = datepickerUtils.getDateFromDateString(startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(sluttdato);

    if (frilansStartdato && harSvartErFrilanserEllerHarFrilansoppdrag(harHattInntektSomFrilanser, frilansoppdrag)) {
        return erFrilanserITidsrom(søknadsperiode, frilansStartdato, frilansSluttdato);
    }
    return false;
};
/**
 *
 * @param periode
 * @param startdato
 * @param sluttdato
 * @param jobberFortsattSomFrilans
 * @returns DateRange
 *
 * Avkort periode med evt start og sluttdato som frilanser.
 * Returnerer undefined dersom start og/eller slutt som frilanser
 * gjør at bruker ikke var frilanser i perioden
 */

export const getPeriodeSomFrilanserInnenforPeriode = (
    periode: DateRange,
    { startdato, sluttdato, jobberFortsattSomFrilans }: FrilansFormData
): DateRange | undefined => {
    const frilansStartdato = datepickerUtils.getDateFromDateString(startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(sluttdato);

    if (frilansStartdato === undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Startdato ikke satt');
        return undefined;
    }
    if (jobberFortsattSomFrilans === YesOrNo.YES && sluttdato !== undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Jobber fortsatt som frilanser, men sluttdato er satt');
        return undefined;
    }
    if (jobberFortsattSomFrilans === YesOrNo.NO && !frilansSluttdato) {
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
