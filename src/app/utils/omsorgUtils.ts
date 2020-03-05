import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

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
