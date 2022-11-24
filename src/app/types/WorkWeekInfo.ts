import { DateRange } from '@navikt/sif-common-formik/lib';
import { ISODateRange } from '@navikt/sif-common-utils/lib';

export interface WorkWeekInfoMap<T> {
    [key: ISODateRange]: T & WorkWeekInfo;
}

export interface WorkWeekInfo {
    weekNumber: number;
    year: number;
    dateRange: DateRange;
    dateRangeWorkingDays?: DateRange;
    isFullWorkWeek: boolean;
}
