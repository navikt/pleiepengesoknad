import { NormalarbeidstidApiData } from '../../types/SøknadApiData';
import { NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { durationWeekdaysToTimerFasteDagerApiData } from './arbeidToApiDataHelpers';

export const getNormalarbeidstidApiDataFromSøknadsdata = (
    normalarbeidstid: NormalarbeidstidSøknadsdata
): NormalarbeidstidApiData => {
    const timerFasteDager = durationWeekdaysToTimerFasteDagerApiData(normalarbeidstid.fasteDager);
    if (normalarbeidstid.erLiktHverUke) {
        return {
            erLiktHverUke: true,
            timerFasteDager,
        };
    }
    return {
        erLiktHverUke: false,
        timerFasteDager,
        timerPerUke: normalarbeidstid.timerPerUke,
    };
};
