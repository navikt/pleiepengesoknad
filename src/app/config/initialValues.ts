import { PleiepengesøknadField, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';

export const initialValues: PleiepengesøknadFormData = {
    [PleiepengesøknadField.ArbeidsgiversNavn]: '',
    [PleiepengesøknadField.ArbeidsgiversAdresse]: '',
    [PleiepengesøknadField.BarnetsEtternavn]: '',
    [PleiepengesøknadField.BarnetsAdresse]: '',
    [PleiepengesøknadField.BarnetsFødselsnummer]: '',
    [PleiepengesøknadField.BarnetsFornavn]: '',
    [PleiepengesøknadField.BarnetSøknadenGjelder]: '',
    [PleiepengesøknadField.HarGodkjentVilkår]: false,
    [PleiepengesøknadField.HarBekreftetOpplysninger]: false,
    [PleiepengesøknadField.SøkersRelasjonTilBarnet]: '',
    [PleiepengesøknadField.SøknadenGjelderEtAnnetBarn]: false
};
