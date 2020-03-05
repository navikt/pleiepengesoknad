import { getSkalBekrefteOmsorg } from '../api/api';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { apiUtils } from './apiUtils';
import { navigateToLoginPage } from './navigationUtils';

export const skalSjekkeOmBrukerMåBekrefteOmsorgIPerioden = ({
    barnetSøknadenGjelder,
    barnetsFødselsnummer,
    barnetHarIkkeFåttFødselsnummerEnda
}: Partial<PleiepengesøknadFormData>): boolean => {
    if (barnetHarIkkeFåttFødselsnummerEnda) {
        return false;
    }
    if (barnetSøknadenGjelder !== undefined || barnetsFødselsnummer !== undefined) {
        return true;
    }
    return true;
};

export async function getSkalBrukerBekrefteOmsorgForBarnet(id: string, erRegistrertBarn: boolean) {
    try {
        const response = await getSkalBekrefteOmsorg(id, erRegistrertBarn);
        return response.data.skalBekrefteOmsorg === true;
    } catch (error) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        }
        return true;
    }
}
