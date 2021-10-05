import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { AppFormField, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

dayjs.extend(isSameOrAfter);

export const erFrilanserISøknadsperiode = ({
    frilans_harHattInntektSomFrilanser,
    frilans_jobberFortsattSomFrilans,
    frilans_sluttdato,
    frilans_startdato,
    periodeFra,
    periodeTil,
}: Pick<
    PleiepengesøknadFormData,
    | AppFormField.frilans_harHattInntektSomFrilanser
    | AppFormField.frilans_jobberFortsattSomFrilans
    | AppFormField.frilans_sluttdato
    | AppFormField.frilans_startdato
    | AppFormField.periodeFra
    | AppFormField.periodeTil
>): boolean => {
    if (frilans_harHattInntektSomFrilanser !== YesOrNo.YES) {
        return false;
    }
    if (frilans_jobberFortsattSomFrilans === YesOrNo.YES) {
        return true;
    }

    const periodeTilDato = datepickerUtils.getDateFromDateString(periodeTil);
    const frilansStartdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    const periodeFraDato = datepickerUtils.getDateFromDateString(periodeFra);
    const frilansSluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    if (periodeTilDato && frilansStartdato && dayjs(frilansStartdato).isAfter(periodeTilDato)) {
        return false;
    }
    return periodeFraDato && frilansSluttdato ? dayjs(frilansSluttdato).isSameOrAfter(periodeFraDato, 'day') : false;
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
    const startdato = datepickerUtils.getDateFromDateString(frilans_startdato);
    const sluttdato = datepickerUtils.getDateFromDateString(frilans_sluttdato);

    if (startdato === undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Startdato ikke satt');
        return undefined;
    }
    if (frilans_jobberFortsattSomFrilans === YesOrNo.YES && frilans_sluttdato !== undefined) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Jobber fortsatt som frilanser, men sluttdato er satt');
        return undefined;
    }
    if (frilans_jobberFortsattSomFrilans === YesOrNo.NO && !sluttdato) {
        console.error('getPeriodeSomFrilanserInneforPeriode - Er ikke frilanser, men sluttdato er ikke satt');
        return undefined;
    }

    if (dayjs(startdato).isAfter(periode.to, 'day')) {
        return undefined;
    }
    if (sluttdato && dayjs(sluttdato).isBefore(periode.from, 'day')) {
        return undefined;
    }

    const fromDate: Date = dayjs.max([dayjs(periode.from), dayjs(startdato)]).toDate();
    const toDate: Date = sluttdato ? dayjs.min([dayjs(periode.to), dayjs(sluttdato)]).toDate() : periode.to;

    return {
        from: fromDate,
        to: toDate,
    };
};
