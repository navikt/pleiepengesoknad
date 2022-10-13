import { DateRange } from '@navikt/sif-common-formik/lib';
import { WeekOfYearMapKey } from '../utils/weekOfYearUtils';

export interface WeekOfYearMap<T> {
    [key: WeekOfYearMapKey]: T & WeekOfYearInfo;
}

export interface WeekOfYearInfo {
    weekNumber: number;
    year: number;
    dateRange: DateRange;
}
