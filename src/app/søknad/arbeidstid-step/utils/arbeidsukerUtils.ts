import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { ArbeidIPeriodeFormField } from '../../../types/ArbeidIPeriodeFormValues';
import { WeekOfYearInfo } from '../../../types/WeekOfYear';
import { ArbeidsukeFieldName } from '../types/Arbeidsuke';

dayjs.extend(weekOfYear);

const getArbeidsukeFieldKey = (uke: DateRange): string => `${uke.from.getFullYear()}_${dayjs(uke.from).week()}`;

export const getArbeidsukeFieldName = (parentFieldName: string, week: WeekOfYearInfo): ArbeidsukeFieldName =>
    `${parentFieldName}.${ArbeidIPeriodeFormField.arbeidsuker}.${getArbeidsukeFieldKey(week.dateRange)}`;

// export const getArbeidsukerForInput = (parentFieldName: string, periode: DateRange): Arbeidsuke[] => {
//     const arbeidsuker: Arbeidsuke[] = [];
//     getWeeksInDateRange(periode).forEach((uke) => {
//         arbeidsuker.push({
//             ...getWeekOfYearFromWeek(uke),
//             ,
//         });
//     });
//     return arbeidsuker;
// };
