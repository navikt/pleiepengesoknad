import { OpenDateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import {
    DateDurationMap,
    dateRangeUtils,
    durationToDecimalDuration,
    DurationWeekdays,
    getDatesWithDurationLongerThanZero,
    getWeekdayFromDate,
    getWeekdaysWithDuration,
    getWeeksInDateRange,
    ISODateToDate,
    summarizeDurationInDurationWeekdays,
    Weekday,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import { ArbeidsukerTimerSøknadsdata } from '../../../types/søknadsdata/arbeidIPeriodeSøknadsdata';
import { ArbeidsforholdSøknadsdata } from '../../../types/søknadsdata/arbeidsforholdSøknadsdata';
import { ArbeidSøknadsdata } from '../../../types/søknadsdata/arbeidSøknadsdata';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import { WeekOfYearInfo } from '../../../types/WeekOfYear';
import { getWeekOfYearInfoFromDateRange } from '../../../utils/weekOfYearUtils';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const getDurationWeekdaysNotInDurationWeekdays = (
    weekdays1: DurationWeekdays,
    weekdays2: DurationWeekdays
): Weekday[] => {
    const diff: Weekday[] = [];
    Object.keys(weekdays2).forEach((weekday) => {
        const duration = weekdays2[weekday];
        if (duration && durationToDecimalDuration(duration) > 0 && weekdays1[weekday] === undefined) {
            diff.push(weekday as Weekday);
        }
    });
    return diff;
};

export const arbeiderFasteAndreDagerEnnNormalt = (normalt: DurationWeekdays, faktisk: DurationWeekdays = {}): boolean =>
    getDurationWeekdaysNotInDurationWeekdays(normalt, faktisk).length > 0;

export const arbeiderAndreEnkeltdagerEnnNormalt = (
    normalt: DurationWeekdays,
    enkeltdager: DateDurationMap = {}
): boolean => {
    const ukedager = getWeekdaysWithDuration(normalt);
    if (ukedager.length === 5) {
        return false; // Jobber alle ukedager
    }
    const dagerMedTid = getDatesWithDurationLongerThanZero(enkeltdager);
    const harDagerPåAndreDager = dagerMedTid.some((isoDate) => {
        const weekday = getWeekdayFromDate(ISODateToDate(isoDate));
        return weekday && ukedager.includes(weekday) === false;
    });
    return harDagerPåAndreDager;
};

const getTimerPerUkeFraFasteUkedager = (timerFasteUkedager: DurationWeekdays): number => {
    return durationToDecimalDuration(summarizeDurationInDurationWeekdays(timerFasteUkedager));
};

export const arbeiderMindreEnnNormaltISnittPerUke = (
    timerISnitt: number,
    normalarbeidstid: NormalarbeidstidSøknadsdata
): boolean => {
    return timerISnitt < normalarbeidstid.timerPerUkeISnitt;
};

export const arbeiderMindreEnnNormaltFasteUkedager = (
    timerFasteUkedager: DurationWeekdays,
    normalarbeidstidFasteUkedager: DurationWeekdays
): boolean => {
    return (
        getTimerPerUkeFraFasteUkedager(timerFasteUkedager) <
        getTimerPerUkeFraFasteUkedager(normalarbeidstidFasteUkedager)
    );
};

export const summerArbeidstimerIArbeidsuker = (arbeidsuker: ArbeidsukerTimerSøknadsdata) => {
    return arbeidsuker.map(({ timer }) => timer || 0).reduce((prev, curr) => prev + curr, 0);
};

export const periodeInneholderToHeleArbeidsuker = (periode: DateRange): boolean => {
    const uker = getWeeksInDateRange(periode).map(getWeekOfYearInfoFromDateRange);
    return uker.filter((uke) => uke.isFullWeek === true).length >= 2;
};

export const skalSvarePåOmEnJobberLiktIPerioden = (periode?: DateRange) =>
    periode ? periodeInneholderToHeleArbeidsuker(periode) : true;

export enum ArbeidsperiodeIForholdTilSøknadsperiode {
    'starterIPerioden' = 'starterIPerioden',
    'slutterIPerioden' = 'slutterIPerioden',
    'starterOgSlutterIPerioden' = 'starterOgSlutterIPerioden',
    'gjelderHelePerioden' = 'gjelderHelePerioden',
}
export const getArbeidsperiodeIForholdTilSøknadsperiode = (
    periode: OpenDateRange,
    søknadsperiode: DateRange
): ArbeidsperiodeIForholdTilSøknadsperiode => {
    if (
        dateRangeUtils.isDateInsideDateRange(periode.from, søknadsperiode) &&
        periode.to &&
        dateRangeUtils.isDateInsideDateRange(periode.to, søknadsperiode)
    ) {
        return ArbeidsperiodeIForholdTilSøknadsperiode.starterOgSlutterIPerioden;
    } else if (dateRangeUtils.isDateInsideDateRange(periode.from, søknadsperiode)) {
        return ArbeidsperiodeIForholdTilSøknadsperiode.starterIPerioden;
    } else if (periode.to && dateRangeUtils.isDateInsideDateRange(periode.to, søknadsperiode)) {
        return ArbeidsperiodeIForholdTilSøknadsperiode.slutterIPerioden;
    }
    return ArbeidsperiodeIForholdTilSøknadsperiode.gjelderHelePerioden;
};

export const harFraværFraJobb = (arbeidsforhold: ArbeidsforholdSøknadsdata[]): boolean => {
    return arbeidsforhold.some(({ arbeidISøknadsperiode }) => {
        if (!arbeidISøknadsperiode) {
            return false;
        }
        return arbeidISøknadsperiode.type !== ArbeidIPeriodeType.arbeiderVanlig;
    });
};

export const harArbeidIPerioden = (arbeid?: ArbeidSøknadsdata): boolean =>
    arbeid !== undefined && getArbeidsforhold(arbeid).length > 0;

export const getArbeidsforhold = (arbeid?: ArbeidSøknadsdata): ArbeidsforholdSøknadsdata[] => {
    if (arbeid === undefined) {
        return [];
    }
    const arbeidsgivere: ArbeidsforholdSøknadsdata[] = [];
    arbeid.arbeidsgivere?.forEach((a) => {
        if (a.erAnsattISøknadsperiode) {
            arbeidsgivere.push(a.arbeidsforhold);
        }
    });
    const frilans: ArbeidsforholdSøknadsdata[] = arbeid.frilans?.erFrilanser ? [arbeid.frilans.arbeidsforhold] : [];
    const selvstendig: ArbeidsforholdSøknadsdata[] = arbeid.selvstendig?.erSN
        ? [arbeid.selvstendig.arbeidsforhold]
        : [];
    return [...arbeidsgivere, ...frilans, ...selvstendig];
};

export const getArbeidsukerIPerioden = (periode: DateRange): WeekOfYearInfo[] => {
    return getWeeksInDateRange(periode)
        .filter((uke) => dayjs(uke.from).isoWeekday() <= 5) // Ikke ta med uker som starter lørdag eller søndag
        .map(getWeekOfYearInfoFromDateRange);
};
