import { DateRange } from '@navikt/sif-common-formik/lib';
import { ISODateRange } from '@navikt/sif-common-utils/lib';

export interface WeekOfYearMap<T> {
    [key: ISODateRange]: T & WeekOfYearInfo;
}

export interface WeekOfYearInfo {
    weekNumber: number;
    year: number;
    dateRange: DateRange;
    isFullWeek: boolean;
    numberOfWorkdays: number;
    numberOfDaysInWeek: number;
}
