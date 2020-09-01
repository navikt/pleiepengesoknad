import { hasValue } from '@sif-common/core/validation/hasValue';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { Søkerdata } from '../types/Søkerdata';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { Barn } from '../types/BarnResponse';

export const søkerHarBarn = (søkerdata: Søkerdata) => {
    return søkerdata.barn && søkerdata.barn.length > 0;
};

export const søkerHarValgtRegistrertBarn = (values: Partial<PleiepengesøknadFormData>): boolean => {
    return hasValue(values.barnetSøknadenGjelder) && values.søknadenGjelderEtAnnetBarn !== true;
};

export const brukerSkalBekrefteOmsorgForBarnet = (
    values: Partial<PleiepengesøknadFormData>,
    registrerteBarn?: Barn[]
): boolean => {
    if (!isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG)) {
        return false;
    }
    const valgtBarn: Barn | undefined = (registrerteBarn || []).find((b) => b.aktørId === values.barnetSøknadenGjelder);
    if (valgtBarn && valgtBarn.harSammeAdresse === true) {
        return false;
    }
    return true;
};

export const brukerSkalBeskriveOmsorgForBarnet = (
    values: Partial<PleiepengesøknadFormData>,
    registrerteBarn?: Barn[]
): boolean => {
    if (!isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG)) {
        return false;
    }
    const valgtBarn: Barn | undefined = (registrerteBarn || []).find((b) => b.aktørId === values.barnetSøknadenGjelder);
    if (valgtBarn) {
        return false;
    }
    return true;
};
