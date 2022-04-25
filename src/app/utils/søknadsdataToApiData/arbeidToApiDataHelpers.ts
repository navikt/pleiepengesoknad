import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidstidEnkeltdagApiData } from '@navikt/sif-common-pleiepenger/lib';
import {
    DateDurationMap,
    dateToISODate,
    Duration,
    durationToISODuration,
    DurationWeekdays,
    getDateDurationMapFromDurationWeekdaysInDateRange,
    getDurationsInDateRange,
    ISODate,
    ISODuration,
    ISODurationToMaybeDuration,
} from '@navikt/sif-common-utils';
import { ArbeiderIPeriodenSvar } from '../../types/ArbeidIPeriodeFormData';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    TimerFasteDagerApiData,
} from '../../types/søknad-api-data/SøknadApiData';
import {
    ArbeidIPeriodeSøknadsdata,
    ArbeidIPeriodeType,
    ArbeidsforholdSøknadsdata,
    NormalarbeidstidSøknadsdata,
    NormalarbeidstidType,
} from '../../types/søknadsdata/Søknadsdata';
import { getNormalarbeidstidApiDataFromSøknadsdata } from './getNormalarbeidstidApiDataFromSøknadsdata';

export const dateToISODateOrUndefined = (date?: Date): ISODate | undefined => (date ? dateToISODate(date) : undefined);

export const durationToISODurationOrUndefined = (duration?: Duration): ISODuration | undefined =>
    duration ? durationToISODuration(duration) : undefined;

export const ISODurationToDurationOrUndefined = (isoDuration?: ISODuration): Duration | undefined =>
    isoDuration ? ISODurationToMaybeDuration(isoDuration) : undefined;

export const durationWeekdaysToTimerFasteDagerApiData = (
    durationWeekdays: DurationWeekdays
): TimerFasteDagerApiData => {
    return {
        mandag: durationToISODurationOrUndefined(durationWeekdays.monday),
        tirsdag: durationToISODurationOrUndefined(durationWeekdays.tuesday),
        onsdag: durationToISODurationOrUndefined(durationWeekdays.wednesday),
        torsdag: durationToISODurationOrUndefined(durationWeekdays.thursday),
        fredag: durationToISODurationOrUndefined(durationWeekdays.friday),
    };
};

export const timerFasteDagerApiDataToDurationWeekdays = (timerFasteDager: TimerFasteDagerApiData): DurationWeekdays => {
    return {
        monday: ISODurationToDurationOrUndefined(timerFasteDager.mandag),
        tuesday: ISODurationToDurationOrUndefined(timerFasteDager.tirsdag),
        wednesday: ISODurationToDurationOrUndefined(timerFasteDager.onsdag),
        thursday: ISODurationToDurationOrUndefined(timerFasteDager.torsdag),
        friday: ISODurationToDurationOrUndefined(timerFasteDager.fredag),
    };
};

export const arbeidEnkeltdagerToArbeidstidEnkeltdagApiData = (
    enkeltdager: DateDurationMap,
    normalarbeidstidFasteDager: DurationWeekdays,
    søknadsperiode: DateRange,
    arbeidsperiode?: DateRange
): ArbeidstidEnkeltdagApiData[] => {
    const arbeidstidEnkeltdager: ArbeidstidEnkeltdagApiData[] = [];
    const alleDager = getDateDurationMapFromDurationWeekdaysInDateRange(søknadsperiode, normalarbeidstidFasteDager);
    const dagerSomSkalVæreMed = arbeidsperiode ? getDurationsInDateRange(alleDager, arbeidsperiode) : alleDager;
    Object.keys(dagerSomSkalVæreMed).forEach((dato) => {
        const faktiskTimer = enkeltdager[dato] || { hours: 0, minutes: 0 };
        const normaltimer = dagerSomSkalVæreMed[dato];
        if (faktiskTimer && normaltimer) {
            arbeidstidEnkeltdager.push({
                dato,
                arbeidstimer: {
                    faktiskTimer: durationToISODuration(faktiskTimer),
                    normalTimer: durationToISODuration(normaltimer),
                },
            });
        }
    });
    return arbeidstidEnkeltdager;
};

export const getArbeidIPeriodeApiDataFromSøknadsdata = (
    arbeid: ArbeidIPeriodeSøknadsdata | undefined,
    normalarbeidstid: NormalarbeidstidSøknadsdata,
    søknadsperiode: DateRange,
    arbeidsperiode?: DateRange
): ArbeidIPeriodeApiData | undefined => {
    if (arbeid) {
        switch (arbeid.type) {
            case ArbeidIPeriodeType.arbeiderIkke:
                return {
                    type: ArbeidIPeriodeType.arbeiderIkke,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær,
                };
            case ArbeidIPeriodeType.arbeiderVanlig:
                return {
                    type: ArbeidIPeriodeType.arbeiderVanlig,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig,
                };
            case ArbeidIPeriodeType.arbeiderEnkeltdager:
                if (normalarbeidstid.type === NormalarbeidstidType.likeUkerOgDager) {
                    const enkeltdager = arbeidEnkeltdagerToArbeidstidEnkeltdagApiData(
                        arbeid.enkeltdager,
                        normalarbeidstid.timerFasteUkedager,
                        søknadsperiode,
                        arbeidsperiode
                    );

                    return {
                        type: ArbeidIPeriodeType.arbeiderEnkeltdager,
                        arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                        enkeltdager,
                    };
                }
                return undefined;
            case ArbeidIPeriodeType.arbeiderProsentAvNormalt:
                return {
                    type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                    prosentAvNormalt: arbeid.prosentAvNormalt,
                };
            case ArbeidIPeriodeType.arbeiderTimerISnittPerUke:
                return {
                    type: ArbeidIPeriodeType.arbeiderTimerISnittPerUke,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                    timerPerUke: arbeid.timerISnittPerUke,
                };
            case ArbeidIPeriodeType.arbeiderFasteUkedager:
                return {
                    type: ArbeidIPeriodeType.arbeiderFasteUkedager,
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                    erLiktHverUke: true,
                    fasteDager: durationWeekdaysToTimerFasteDagerApiData(arbeid.fasteDager),
                };
        }
    }
    return undefined;
};

export const getArbeidsforholdApiDataFromSøknadsdata = (
    arbeidsforhold: ArbeidsforholdSøknadsdata,
    søknadsperiode: DateRange,
    arbeidsperiode?: DateRange
): ArbeidsforholdApiData => {
    const normalarbeidstid = getNormalarbeidstidApiDataFromSøknadsdata(arbeidsforhold.normalarbeidstid);
    return {
        normalarbeidstid,
        arbeidIPeriode: getArbeidIPeriodeApiDataFromSøknadsdata(
            arbeidsforhold.arbeidISøknadsperiode,
            arbeidsforhold.normalarbeidstid,
            søknadsperiode,
            arbeidsperiode
        ),
    };
};
