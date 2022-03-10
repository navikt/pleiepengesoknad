import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Virksomhet } from '@navikt/sif-common-forms/lib';
import dayjs from 'dayjs';

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
