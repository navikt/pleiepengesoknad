import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { dateToISODate, decimalDurationToISODuration, ISODateRangeToDateRange } from '@navikt/sif-common-utils';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    ArbeidsukeProsentApiData,
    ArbeidsukeTimerApiData,
} from '../../types/søknad-api-data/SøknadApiData';
import {
    ArbeidIPeriodeSøknadsdata,
    ArbeidsforholdSøknadsdata,
    ArbeidsukerProsentSøknadsdata,
    ArbeidsukerTimerSøknadsdata,
} from '../../types/søknadsdata/Søknadsdata';
import { getNormalarbeidstidApiDataFromSøknadsdata } from './getNormalarbeidstidApiDataFromSøknadsdata';

export const getArbeidsukerTimerApiData = (arbeidsuker: ArbeidsukerTimerSøknadsdata): ArbeidsukeTimerApiData[] => {
    return Object.keys(arbeidsuker).map((key) => {
        const { from, to } = ISODateRangeToDateRange(key);
        const arbeidsuke = arbeidsuker[key];
        return {
            periode: {
                from: dateToISODate(from),
                to: dateToISODate(to),
            },
            timer: decimalDurationToISODuration(arbeidsuke.timer),
        };
    });
};

export const getArbeidsukerProsentApiData = (
    arbeidsuker: ArbeidsukerProsentSøknadsdata
): ArbeidsukeProsentApiData[] => {
    return Object.keys(arbeidsuker).map((key) => {
        const { from, to } = ISODateRangeToDateRange(key);
        const { prosentAvNormalt } = arbeidsuker[key];
        return {
            periode: {
                from: dateToISODate(from),
                to: dateToISODate(to),
            },
            prosentAvNormalt,
        };
    });
};

export const getArbeidIPeriodeApiDataFromSøknadsdata = (arbeid: ArbeidIPeriodeSøknadsdata): ArbeidIPeriodeApiData => {
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
                timerPerUke: decimalDurationToISODuration(arbeid.timerISnittPerUke),
            };
        case ArbeidIPeriodeType.arbeiderUlikeUkerProsent:
            return {
                type: ArbeidIPeriodeType.arbeiderUlikeUkerProsent,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                arbeidsuker: getArbeidsukerProsentApiData(arbeid.arbeidsuker),
            };
        case ArbeidIPeriodeType.arbeiderUlikeUkerTimer:
            return {
                type: ArbeidIPeriodeType.arbeiderUlikeUkerTimer,
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                arbeidsuker: getArbeidsukerTimerApiData(arbeid.arbeidsuker),
            };
    }
};

export const getArbeidsforholdApiDataFromSøknadsdata = (
    arbeidsforhold: ArbeidsforholdSøknadsdata
): ArbeidsforholdApiData => {
    const { normalarbeidstid, arbeidISøknadsperiode } = arbeidsforhold;
    return {
        normalarbeidstid: getNormalarbeidstidApiDataFromSøknadsdata(normalarbeidstid),
        arbeidIPeriode: arbeidISøknadsperiode
            ? getArbeidIPeriodeApiDataFromSøknadsdata(arbeidISøknadsperiode)
            : undefined,
    };
};
