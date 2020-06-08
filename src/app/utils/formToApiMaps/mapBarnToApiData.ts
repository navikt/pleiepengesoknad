import { formatDateToApiFormat, } from 'common/utils/dateUtils';
import { formatName, } from 'common/utils/personUtils';
import { BarnToSendToApi, } from '../../types/PleiepengesøknadApiData';
import { BarnReceivedFromApi, } from '../../types/Søkerdata';

export const mapBarnToApiData = (
    barn: BarnReceivedFromApi[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetsFødselsdato: Date | undefined,
    barnetSøknadenGjelder: string | undefined
): BarnToSendToApi => {
    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktørId === barnetSøknadenGjelder)!;
        const { fornavn, etternavn, mellomnavn, aktørId, harSammeAdresse: sammeAdresse } = barnChosenFromList;
        return {
            navn: formatName(fornavn, etternavn, mellomnavn),
            fødselsnummer: null,
            aktørId,
            fødselsdato: formatDateToApiFormat(barnChosenFromList.fødselsdato),
            sammeAdresse: sammeAdresse || null
        };
    } else {
        return {
            navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
            fødselsnummer: barnetsFødselsnummer || null,
            aktørId: null,
            fødselsdato: barnetsFødselsdato !== undefined ? formatDateToApiFormat(barnetsFødselsdato) : null,
            sammeAdresse: null
        };
    }
};
