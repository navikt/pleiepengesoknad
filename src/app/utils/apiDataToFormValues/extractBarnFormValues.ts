import { RegistrerteBarn } from '../../types';
import { BarnetSøknadenGjelderApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';

type BarnFormValues = Pick<SøknadFormValues, SøknadFormField.barnetSøknadenGjelder>;

const barnErBlantRegistrerteBarn = (aktørId: string, registrerteBarn: RegistrerteBarn[]): boolean => {
    return registrerteBarn.findIndex((b) => b.aktørId === aktørId) >= 0;
};

export const extractBarnFormValues = (
    barn: BarnetSøknadenGjelderApiData,
    registrerteBarn: RegistrerteBarn[]
): BarnFormValues | undefined => {
    if (barn.aktørId === undefined) {
        return undefined;
    }
    if (barnErBlantRegistrerteBarn(barn.aktørId, registrerteBarn) === false) {
        return undefined;
    }
    return {
        barnetSøknadenGjelder: barn.aktørId,
    };
};
