import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi, Søkerdata } from '../types/Søkerdata';
import { Feature, isFeatureEnabled } from './featureToggleUtils';

export const søkerHarBarn = (søkerdata: Søkerdata) => {
    return søkerdata.barn && søkerdata.barn.length > 0;
};

export const søkerHarValgtRegistrertBarn = (values: Partial<PleiepengesøknadFormData>): boolean => {
    return hasValue(values.barnetSøknadenGjelder) && values.søknadenGjelderEtAnnetBarn !== true;
};

export const brukerSkalBekrefteOmsorgForBarnet = (
    values: Partial<PleiepengesøknadFormData>,
    registrerteBarn?: BarnReceivedFromApi[]
): boolean => {
    if (!isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG)) {
        return false;
    }
    const valgtBarn: BarnReceivedFromApi | undefined = (registrerteBarn || []).find(
        (b) => b.aktørId === values.barnetSøknadenGjelder
    );
    if (valgtBarn && valgtBarn.harSammeAdresse === true) {
        return false;
    }
    return true;
};

export const brukerSkalBeskriveOmsorgForBarnet = (
    values: Partial<PleiepengesøknadFormData>,
    registrerteBarn?: BarnReceivedFromApi[]
): boolean => {
    if (!isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG)) {
        return false;
    }
    const valgtBarn: BarnReceivedFromApi | undefined = (registrerteBarn || []).find(
        (b) => b.aktørId === values.barnetSøknadenGjelder
    );
    if (valgtBarn) {
        return false;
    }
    return true;
};
