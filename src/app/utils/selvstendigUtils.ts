import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
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
    virksomhetOppstartDato: Date
): DateRange | undefined => {
    if (dayjs(virksomhetOppstartDato).isAfter(periode.to, 'day')) {
        return undefined;
    }
    return {
        from: dayjs.max([dayjs(periode.from), dayjs(virksomhetOppstartDato)]).toDate(),
        to: periode.to,
    };
};
