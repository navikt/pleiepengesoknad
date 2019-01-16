const moment = require('moment');
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';

export const mapFormDataToApiData = ({
    arbeidsgiversAdresse,
    arbeidsgiversNavn,
    barnetsAdresse,
    barnetsEtternavn,
    barnetsFornavn,
    barnetsFødselsnummer,
    barnetSøknadenGjelder,
    harBekreftetOpplysninger,
    harGodkjentVilkår,
    søkersRelasjonTilBarnet
}: PleiepengesøknadFormData): PleiepengesøknadApiData => {
    const date = moment()
        .subtract(1, 'day')
        .toDate();
    return {
        barn: [
            {
                fornavn: barnetsFornavn,
                mellomnavn: '',
                etternavn: barnetsEtternavn,
                fodselsnummer: barnetsFødselsnummer,
                fodselsdato: date,
                relasjon: søkersRelasjonTilBarnet
            }
        ],
        ansettelsesforhold: [{ navn: arbeidsgiversNavn }],
        fra_og_med: date,
        til_og_med: date,
        vedlegg: [{ innhold: [-1, -40, -1, -37, 0, -124, 0, 8, 6, 6, 7, 6, 5, 8, 7] }]
    };
};
