import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { BarnToSendToApi } from '../../types/PleiepengesøknadApiData';
import { BarnReceivedFromApi } from '../../types/Søkerdata';

export const mapBarnToApiData = (
    alleBarnFraApi: BarnReceivedFromApi[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    valgtBarn: string | undefined
): BarnToSendToApi | undefined => {
    if (valgtBarn) {
        const barnChosenFromList = alleBarnFraApi.find((currentBarn) => currentBarn.aktørId === valgtBarn);
        if (!barnChosenFromList) {
            return undefined;
        }
        const { fornavn, etternavn, mellomnavn, aktørId, harSammeAdresse: sammeAdresse } = barnChosenFromList;
        return {
            aktørId,
            navn: formatName(fornavn, etternavn, mellomnavn),
            fødselsnummer: null,
            fødselsdato: formatDateToApiFormat(barnChosenFromList.fødselsdato),
            sammeAdresse: sammeAdresse || null,
        };
    }
    if (barnetsFødselsnummer && barnetsNavn) {
        return {
            navn: barnetsNavn,
            fødselsnummer: barnetsFødselsnummer,
            aktørId: null,
            fødselsdato: null,
            sammeAdresse: null,
        };
    }
    return undefined;
};
