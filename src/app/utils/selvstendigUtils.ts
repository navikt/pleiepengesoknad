import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import { SelvstendigFormData } from '../types/SelvstendigFormData';
import dayjs from 'dayjs';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

/**
 *
 * @param periode
 * @param frilans_startdato
 * @param frilans_sluttdato
 * @param frilans_jobberFortsattSomFrilans
 * @returns DateRange
 *
 * Avkort periode med startdato for virksomhet
 * Returnerer undefined dersom start er etter periodes start
 */

export const getPeriodeSomSelvstendigInnenforPeriode = (
    periode: DateRange,
    virksomhet?: Virksomhet
): DateRange | undefined => {
    if (virksomhet === undefined || dayjs(virksomhet.fom).isAfter(periode.to, 'day')) {
        return undefined;
    }
    return {
        from: dayjs.max([dayjs(periode.from), dayjs(virksomhet.fom)]).toDate(),
        to: periode.to,
    };
};

export const erSNITidsrom = (tidsrom: DateRange, snStartdato: Date, snSluttdato?: Date): boolean => {
    if (dayjs(snStartdato).isAfter(tidsrom.to, 'day')) {
        return false;
    }
    if (snSluttdato && dayjs(snSluttdato).isBefore(tidsrom.from, 'day')) {
        return false;
    }
    return true;
};

export const erSNISøknadsperiode = (
    søknadsperiode: DateRange,
    { harHattInntektSomSN, virksomhet }: SelvstendigFormData
): boolean => {
    if (harHattInntektSomSN !== YesOrNo.YES) {
        return false;
    }

    if (!virksomhet) {
        return false;
    }

    if (!virksomhet.fom) {
        return false;
    }

    return erSNITidsrom(søknadsperiode, virksomhet.fom, virksomhet.tom);
};
