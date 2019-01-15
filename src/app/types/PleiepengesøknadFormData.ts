export enum PleiepengesøknadField {
    HarGodkjentVilkår = 'harGodkjentVilkår',
    BarnetsEtternavn = 'barnetsEtternavn',
    BarnetsFornavn = 'barnetsFornavn',
    BarnetsFødselsnummer = 'barnetsFødselsnummer',
    BarnetsAdresse = 'barnetsAdresse',
    BarnetSøknadenGjelder = 'barnetSøknadenGjelder',
    ArbeidsgiversNavn = 'arbeidsgiversNavn',
    ArbeidsgiversAdresse = 'arbeidsgiversAdresse',
    SøkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    SøknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn'
}

export interface PleiepengesøknadFormData {
    [PleiepengesøknadField.HarGodkjentVilkår]: boolean;
    [PleiepengesøknadField.BarnetsEtternavn]: string;
    [PleiepengesøknadField.BarnetsFornavn]: string;
    [PleiepengesøknadField.BarnetsAdresse]: string;
    [PleiepengesøknadField.BarnetsFødselsnummer]: string;
    [PleiepengesøknadField.ArbeidsgiversNavn]: string;
    [PleiepengesøknadField.ArbeidsgiversAdresse]: string;
    [PleiepengesøknadField.SøkersRelasjonTilBarnet]: string;
    [PleiepengesøknadField.SøknadenGjelderEtAnnetBarn]: boolean;
    [PleiepengesøknadField.BarnetSøknadenGjelder]: string;
}
