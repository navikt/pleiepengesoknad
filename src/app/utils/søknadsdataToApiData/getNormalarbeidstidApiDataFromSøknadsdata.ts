import { decimalDurationToISODuration } from '@navikt/sif-common-utils/lib';
import { NormalarbeidstidApiData } from '../../types/søknad-api-data/SøknadApiData';
import { NormalarbeidstidSøknadsdata } from '../../types/søknadsdata/Søknadsdata';

export const getNormalarbeidstidApiDataFromSøknadsdata = (
    normalarbeidstid: NormalarbeidstidSøknadsdata
): NormalarbeidstidApiData => {
    return {
        timerPerUkeISnitt: decimalDurationToISODuration(normalarbeidstid.timerPerUkeISnitt),
        erLiktHverUke: true /** TODO - skal tas bort */,
        _erLiktSnittSomForrigeSøknad: normalarbeidstid.erLiktSnittSomForrigeSøknad,
    };
};
