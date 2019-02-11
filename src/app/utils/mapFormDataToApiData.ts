const moment = require('moment');
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';

export const mapFormDataToApiData = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetSøknadenGjelder,
    harBekreftetOpplysninger,
    harGodkjentVilkår,
    søkersRelasjonTilBarnet,
    ansettelsesforhold
}: PleiepengesøknadFormData): PleiepengesøknadApiData => {
    const date = moment()
        .subtract(2, 'days')
        .toDate();
    return {
        barn: [
            {
                navn: barnetsNavn,
                fodselsnummer: barnetsFødselsnummer,
                fodselsdato: date,
                relasjon: søkersRelasjonTilBarnet
            }
        ],
        ansettelsesforhold,
        fra_og_med: date,
        til_og_med: date,
        vedlegg: [{ innhold: [-1, -40, -1, -37, 0, -124, 0, 8, 6, 6, 7, 6, 5, 8, 7] }]
    };
};
