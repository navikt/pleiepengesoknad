import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { decimalDurationToISODuration } from '@navikt/sif-common-utils';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import {
    ArbeidIPeriodeApiData,
    ArbeidsforholdApiData,
    ArbeidsukerProsentApiData,
    ArbeidsukerTimerApiData,
} from '../../types/søknad-api-data/SøknadApiData';
import {
    ArbeidIPeriodeSøknadsdata,
    ArbeidsforholdSøknadsdata,
    ArbeidsukerProsentSøknadsdata,
    ArbeidsukerTimerSøknadsdata,
} from '../../types/søknadsdata/Søknadsdata';
import { getNormalarbeidstidApiDataFromSøknadsdata } from './getNormalarbeidstidApiDataFromSøknadsdata';

export const getArbeidsukerTimerApiData = (arbeidsuker: ArbeidsukerTimerSøknadsdata): ArbeidsukerTimerApiData => {
    const arbeidsukerApiData: ArbeidsukerTimerApiData = {};
    Object.keys(arbeidsuker).forEach((key) => {
        const arbeidsuke = arbeidsuker[key];
        arbeidsukerApiData[key] = { timer: decimalDurationToISODuration(arbeidsuke.timer) };
    });
    return arbeidsukerApiData;
};

export const getArbeidsukerProsentApiData = (arbeidsuker: ArbeidsukerProsentSøknadsdata): ArbeidsukerProsentApiData => {
    const arbeidsukerApiData: ArbeidsukerProsentSøknadsdata = {};
    Object.keys(arbeidsuker).forEach((key) => {
        const { prosentAvNormalt } = arbeidsuker[key];
        arbeidsukerApiData[key] = { prosentAvNormalt };
    });
    return arbeidsukerApiData;
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
                snittTimerPerUke: decimalDurationToISODuration(arbeid.timerISnittPerUke),
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
