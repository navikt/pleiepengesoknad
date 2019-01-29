export enum Field {
    harGodkjentVilkår = 'harGodkjentVilkår',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    barnetsEtternavn = 'barnetsEtternavn',
    barnetsFornavn = 'barnetsFornavn',
    barnetsFødselsnummer = 'barnetsFødselsnummer',
    barnetsAdresse = 'barnetsAdresse',
    barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    arbeidsgiversNavn = 'arbeidsgiversNavn',
    arbeidsgiversAdresse = 'arbeidsgiversAdresse',
    søkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    legeerklæring = 'legeerklæring'
}

export interface PleiepengesøknadFormData {
    [Field.harGodkjentVilkår]: boolean;
    [Field.harBekreftetOpplysninger]: boolean;
    [Field.barnetsEtternavn]: string;
    [Field.barnetsFornavn]: string;
    [Field.barnetsAdresse]: string;
    [Field.barnetsFødselsnummer]: string;
    [Field.arbeidsgiversNavn]: string;
    [Field.arbeidsgiversAdresse]: string;
    [Field.søkersRelasjonTilBarnet]: string;
    [Field.søknadenGjelderEtAnnetBarn]: boolean;
    [Field.barnetSøknadenGjelder]: string;
    [Field.periodeFra]?: Date;
    [Field.periodeTil]?: Date;
    [Field.legeerklæring]: Attachment[];
}

export const initialValues: PleiepengesøknadFormData = {
    [Field.arbeidsgiversNavn]: '',
    [Field.arbeidsgiversAdresse]: '',
    [Field.barnetsEtternavn]: '',
    [Field.barnetsAdresse]: '',
    [Field.barnetsFødselsnummer]: '',
    [Field.barnetsFornavn]: '',
    [Field.barnetSøknadenGjelder]: '',
    [Field.harGodkjentVilkår]: false,
    [Field.harBekreftetOpplysninger]: false,
    [Field.søkersRelasjonTilBarnet]: '',
    [Field.søknadenGjelderEtAnnetBarn]: false,
    [Field.legeerklæring]: []
};
