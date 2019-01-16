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
}: PleiepengesøknadFormData): PleiepengesøknadApiData => ({
    barn: [
        {
            fornavn: barnetsFornavn,
            mellomnavn: '',
            etternavn: barnetsEtternavn,
            fodselsnummer: barnetsFødselsnummer,
            fodselsdato: '01.01.2019',
            relasjon: søkersRelasjonTilBarnet
        }
    ],
    ansettelsesforhold: [{ navn: arbeidsgiversNavn }],
    fra_og_med: '01.01.2019',
    til_og_med: '05.01.2019',
    vedlegg: [{ innhold: 'JVBERi0xLjQKJfbk/N8KMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovVmVyc2l' }]
});
