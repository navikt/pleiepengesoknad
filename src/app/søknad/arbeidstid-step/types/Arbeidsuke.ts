import { WorkWeekInfo, WorkWeekInfoMap } from '../../../types/WorkWeekInfo';

export type ArbeidsukeFieldName = string; // YYYY_WW

export interface Arbeidsuke extends WorkWeekInfo {
    fieldname: ArbeidsukeFieldName;
}

export type Arbeidsuker = WorkWeekInfoMap<Arbeidsuke>;
