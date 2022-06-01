import { decimalDurationToISODuration } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidApiData } from '../../types/søknad-api-data/SøknadApiData';
import { NormalarbeidstidSøknadsdata, NormalarbeidstidType } from '../../types/søknadsdata/Søknadsdata';
import { durationWeekdaysToTimerFasteDagerApiData } from './arbeidToApiDataHelpers';

export const getNormalarbeidstidApiDataFromSøknadsdata = (
    normalarbeidstid: NormalarbeidstidSøknadsdata
): NormalarbeidstidApiData => {
    if (normalarbeidstid.erLiktHverUke && normalarbeidstid.erFasteUkedager) {
        const timerFasteDager = durationWeekdaysToTimerFasteDagerApiData(normalarbeidstid.timerFasteUkedager);
        return {
            erLiktHverUke: true,
            timerFasteDager,
            _arbeiderDeltid: false,
            _arbeiderHelg: false,
        };
    }

    return {
        erLiktHverUke: false,
        timerPerUkeISnitt: decimalDurationToISODuration(normalarbeidstid.timerPerUkeISnitt),
        _arbeiderHelg: normalarbeidstid.type === NormalarbeidstidType.arbeiderHelg,
        _arbeiderDeltid: normalarbeidstid.type === NormalarbeidstidType.arbeiderDeltid,
    };
};
