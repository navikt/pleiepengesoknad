import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

export const initialValues: PleiepengesøknadFormData = {
    arbeidsgiversNavn: '',
    arbeidsgiversAdresse: '',
    barnetsEtternavn: '',
    barnetsAdresse: '',
    barnetsFnr: '',
    barnetsFornavn: '',
    barnetSøknadenGjelder: '',
    harGodkjentVilkår: false,
    søkersRelasjonTilBarnet: '',
    søknadenGjelderEtAnnetBarn: false
};
