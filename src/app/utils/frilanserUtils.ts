import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AppFormField, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

dayjs.extend(isSameOrAfter);

export const erFrilanserITidsrom = (
    tidsrom: DateRange,
    { frilansStartdato, frilansSluttdato }: { frilansStartdato: Date; frilansSluttdato?: Date }
): boolean => {
    if (dayjs(frilansStartdato).isAfter(tidsrom.to, 'day')) {
        return false;
    }
    if (frilansSluttdato && dayjs(frilansSluttdato).isBefore(tidsrom.from, 'day')) {
        return false;
    }
    return true;
};

export const erFrilanserIPeriode = (
    periode: DateRange,
    {
        frilans_harHattInntektSomFrilanser,
        // frilans_jobberFortsattSomFrilans,
        frilans_sluttdato,
        frilans_startdato,
    }: Pick<
        PleiepengesøknadFormData,
        | AppFormField.frilans_harHattInntektSomFrilanser
        | AppFormField.frilans_jobberFortsattSomFrilans
        | AppFormField.frilans_sluttdato
        | AppFormField.frilans_startdato
    >
): boolean => {
    const frilansStartdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    if (frilans_harHattInntektSomFrilanser !== YesOrNo.YES || frilansStartdato === undefined) {
        return false;
    }
    return erFrilanserITidsrom(periode, { frilansStartdato, frilansSluttdato });
};

/**
 *
 * @param periode
 * @param frilans_startdato
 * @param frilans_sluttdato
 * @param frilans_jobberFortsattSomFrilans
 * @returns DateRange
 *
 * Avkort periode med evt start og sluttdato som frilanser.
 * Returnerer undefined dersom start og/eller slutt som frilanser
 * gjør at bruker ikke var frilanser i perioden
 */

export const getPeriodeSomFrilanserInneforPeriode = (
    periode: DateRange,
    frilans: {
        frilans_startdato?: string;
        frilans_sluttdato?: string;
        frilans_jobberFortsattSomFrilans?: YesOrNo;
    }
): DateRange | undefined => {
    const { frilans_startdato, frilans_sluttdato, frilans_jobberFortsattSomFrilans } = frilans;
    const frilansStartdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    if (frilansStartdato === undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Startdato ikke satt');
        return undefined;
    }
    if (frilans_jobberFortsattSomFrilans === YesOrNo.YES && frilans_sluttdato !== undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Jobber fortsatt som frilanser, men sluttdato er satt');
        return undefined;
    }
    if (frilans_jobberFortsattSomFrilans === YesOrNo.NO && !frilansSluttdato) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Er ikke frilanser, men sluttdato er ikke satt');
        return undefined;
    }

    if (erFrilanserITidsrom(periode, { frilansStartdato, frilansSluttdato }) === false) {
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
