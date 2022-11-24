import { WeekOfYearInfo, WeekOfYearMap } from '../../../types/WeekOfYear';

export type ArbeidsukeFieldName = string; // YYYY_WW

export interface Arbeidsuke extends WeekOfYearInfo {
    fieldname: ArbeidsukeFieldName;
}

export type Arbeidsuker = WeekOfYearMap<Arbeidsuke>;
