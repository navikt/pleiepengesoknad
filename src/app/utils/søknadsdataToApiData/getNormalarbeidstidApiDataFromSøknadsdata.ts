import { durationToDecimalDuration, summarizeDurationInDurationWeekdays } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidApiData } from '../../types/SøknadApiData';
import { NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { durationWeekdaysToTimerFasteDagerApiData } from './arbeidToApiDataHelpers';

export const getNormalarbeidstidApiDataFromSøknadsdata = (
    normalarbeidstid: NormalarbeidstidSøknadsdata
): NormalarbeidstidApiData => {
    const timerFasteDager = durationWeekdaysToTimerFasteDagerApiData(normalarbeidstid.fasteDager);
    if (normalarbeidstid.erLiktHverUke) {
        const timerPerUke = durationToDecimalDuration(summarizeDurationInDurationWeekdays(normalarbeidstid.fasteDager));
        return {
            erLiktHverUke: true,
            timerPerUke,
            timerFasteDager,
        };
    }
    return {
        erLiktHverUke: false,
        timerFasteDager,
        timerPerUke: normalarbeidstid.timerPerUke,
    };
};
