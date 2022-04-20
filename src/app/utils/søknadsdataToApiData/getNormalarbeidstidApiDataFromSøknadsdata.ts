import { decimalDurationToISODuration } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidApiData } from '../../types/søknad-api-data/SøknadApiData';
import { NormalarbeidstidSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { durationWeekdaysToTimerFasteDagerApiData } from './arbeidToApiDataHelpers';

export const getNormalarbeidstidApiDataFromSøknadsdata = (
    normalarbeidstid: NormalarbeidstidSøknadsdata
): NormalarbeidstidApiData => {
    if (normalarbeidstid.erLiktHverUke && normalarbeidstid.erFasteUkedager) {
        const timerFasteDager = durationWeekdaysToTimerFasteDagerApiData(normalarbeidstid.timerFasteUkedager);
        return {
            erLiktHverUke: true,
            timerFasteDager,
        };
    }
    return {
        erLiktHverUke: false,
        timerPerUkeISnitt: decimalDurationToISODuration(normalarbeidstid.timerPerUkeISnitt),
    };
};
