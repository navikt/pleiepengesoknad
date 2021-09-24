import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { BarnApiData } from '../../types/PleiepengesøknadApiData';
import { BarnReceivedFromApi } from '../../types/Søkerdata';

export const mapBarnToApiData = (
    barn: BarnReceivedFromApi[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetSøknadenGjelder: string | undefined
): BarnApiData => {
    const emptyBarn = {
        navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
        fødselsnummer: barnetsFødselsnummer || null,
        aktørId: null,
        fødselsdato: null,
        sammeAdresse: null,
    };

    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktørId === barnetSøknadenGjelder);
        if (barnChosenFromList) {
            const { fornavn, etternavn, mellomnavn, aktørId, harSammeAdresse: sammeAdresse } = barnChosenFromList;
            return {
                navn: formatName(fornavn, etternavn, mellomnavn),
                fødselsnummer: null,
                aktørId,
                fødselsdato: formatDateToApiFormat(barnChosenFromList.fødselsdato),
                sammeAdresse: sammeAdresse || null,
            };
        }
        return emptyBarn;
    } else {
        return emptyBarn;
    }
};
