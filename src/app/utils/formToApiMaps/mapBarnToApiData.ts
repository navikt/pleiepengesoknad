import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { formatName } from 'common/utils/personUtils';
import { BarnToSendToApi } from '../../types/PleiepengesøknadApiData';
import { BarnReceivedFromApi } from '../../types/Søkerdata';

export const mapBarnToApiData = (
    barn: BarnReceivedFromApi[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetsFødselsdato: Date | undefined,
    barnetSøknadenGjelder: string | undefined
): BarnToSendToApi => {
    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktoer_id === barnetSøknadenGjelder)!;
        const { fornavn, etternavn, mellomnavn, aktoer_id, har_samme_adresse: sammeAdresse } = barnChosenFromList;
        return {
            navn: formatName(fornavn, etternavn, mellomnavn),
            fodselsnummer: null,
            aktoer_id,
            fodselsdato: formatDateToApiFormat(barnChosenFromList.fodselsdato),
            samme_adresse: sammeAdresse || null
        };
    } else {
        return {
            navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
            fodselsnummer: barnetsFødselsnummer || null,
            aktoer_id: null,
            fodselsdato: barnetsFødselsdato !== undefined ? formatDateToApiFormat(barnetsFødselsdato) : null,
            samme_adresse: null
        };
    }
};
