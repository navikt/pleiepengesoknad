import { DateRange, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { DagMedTid, TidsbrukDag } from '../types';

export const getDagerMedTidITidsrom = (data: TidsbrukDag, tidsrom: DateRange): DagMedTid[] => {
    const dager: DagMedTid[] = [];
    Object.keys(data || {}).forEach((isoDateString) => {
        const date = ISOStringToDate(isoDateString);
        if (date && datoErInnenforTidsrom(date, tidsrom)) {
            const time = data[isoDateString];
            if (time) {
                dager.push({
                    dato: date,
                    tid: time,
                });
            }
        }
        return false;
    });
    return dager;
};
