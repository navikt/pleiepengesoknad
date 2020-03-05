import { hasValue } from '@navikt/sif-common/lib/common/validation/hasValue';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { Søkerdata } from '../types/Søkerdata';
import { Feature, isFeatureEnabled } from './featureToggleUtils';

export const søkerHarBarn = (søkerdata: Søkerdata) => {
    return søkerdata.barn && søkerdata.barn.length > 0;
};

export const søkerHarValgtRegistrertBarn = (values: Partial<PleiepengesøknadFormData>): boolean => {
    return hasValue(values.barnetSøknadenGjelder) && values.søknadenGjelderEtAnnetBarn !== true;
};

export const skalSpørreApiOmBrukerMåBekrefteOmsorg = (
    søkerdata: Partial<Søkerdata>,
    values: Partial<PleiepengesøknadFormData>
): boolean => {
    if (!isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG)) {
        return false;
    }
    if (values.barnetHarIkkeFåttFødselsnummerEnda === true) {
        return false;
    }
    return hasValue(values.barnetsFødselsnummer) || hasValue(values.barnetSøknadenGjelder);
};
