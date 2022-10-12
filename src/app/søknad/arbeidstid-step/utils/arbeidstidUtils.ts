import {
    DateDurationMap,
    durationToDecimalDuration,
    DurationWeekdays,
    getDatesWithDurationLongerThanZero,
    getWeekdayFromDate,
    getWeekdaysWithDuration,
    ISODateToDate,
    summarizeDurationInDurationWeekdays,
    Weekday,
} from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../../../types/arbeidIPeriodeType';
import {
    ArbeidsukerProsentSøknadsdata,
    ArbeidsukerTimerSøknadsdata,
} from '../../../types/søknadsdata/arbeidIPeriodeSøknadsdata';
import { ArbeidsforholdSøknadsdata } from '../../../types/søknadsdata/arbeidsforholdSøknadsdata';
import { ArbeidSøknadsdata } from '../../../types/søknadsdata/arbeidSøknadsdata';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/normalarbeidstidSøknadsdata';

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
    const timer = Object.keys(arbeidsuker)
        .map((key) => arbeidsuker[key].timerISnittPerUke || 0)
        .reduce((prev, curr) => prev + curr, 0);
    return timer;
};

export const harArbeidsukeMedRedusertProsent = (arbeidsuker: ArbeidsukerProsentSøknadsdata) => {
    return Object.keys(arbeidsuker)
        .map((key) => arbeidsuker[key].prosentAvNormalt || 0)
        .some((prosent) => prosent < 100);
};

export const erArbeidsforholdMedFravær = ({
    arbeidISøknadsperiode,
    normalarbeidstid,
}: ArbeidsforholdSøknadsdata): boolean => {
    if (!arbeidISøknadsperiode) {
        return false;
    }
    switch (arbeidISøknadsperiode.type) {
        case ArbeidIPeriodeType.arbeiderIkke:
            return true;
        case ArbeidIPeriodeType.arbeiderVanlig:
            return false;
        case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
            return arbeidISøknadsperiode.prosentAvNormalt < 100;
        case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
            return arbeiderMindreEnnNormaltISnittPerUke(arbeidISøknadsperiode.timerISnittPerUke, normalarbeidstid);
        case ArbeidIPeriodeType.arbeiderUlikeTimerISnittPerUke:
            return summerArbeidstimerIArbeidsuker(arbeidISøknadsperiode.arbeidsuker) > 0;
        case ArbeidIPeriodeType.arbeiderUlikProsentPerUkeAvNormalt:
            return harArbeidsukeMedRedusertProsent(arbeidISøknadsperiode.arbeidsuker);
    }
};

export const harFraværIPerioden = (arbeidsforhold: ArbeidsforholdSøknadsdata[]): boolean => {
    return arbeidsforhold.some(erArbeidsforholdMedFravær);
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
