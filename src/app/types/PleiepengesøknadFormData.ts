import { Ansettelsesforhold } from './Søkerdata';

export enum Field {
    harGodkjentVilkår = 'harGodkjentVilkår',
    harBekreftetOpplysninger = 'harBekreftetOpplysninger',
    barnetsNavn = 'barnetsNavn',
    barnetsFødselsnummer = 'barnetsFødselsnummer',
    barnetSøknadenGjelder = 'barnetSøknadenGjelder',
    søkersRelasjonTilBarnet = 'søkersRelasjonTilBarnet',
    søknadenGjelderEtAnnetBarn = 'søknadenGjelderEtAnnetBarn',
    periodeFra = 'periodeFra',
    periodeTil = 'periodeTil',
    legeerklæring = 'legeerklæring',
    ansettelsesforhold = 'ansettelsesforhold'
}

export interface PleiepengesøknadFormData {
    [Field.harGodkjentVilkår]: boolean;
    [Field.harBekreftetOpplysninger]: boolean;
    [Field.barnetsNavn]: string;
    [Field.barnetsFødselsnummer]: string;
    [Field.søkersRelasjonTilBarnet]: string;
    [Field.søknadenGjelderEtAnnetBarn]: boolean;
    [Field.barnetSøknadenGjelder]: string;
    [Field.ansettelsesforhold]: Ansettelsesforhold[];
    [Field.periodeFra]?: Date;
    [Field.periodeTil]?: Date;
    [Field.legeerklæring]: Attachment[];
}

export const initialValues: PleiepengesøknadFormData = {
    [Field.barnetsNavn]: '',
    [Field.barnetsFødselsnummer]: '',
    [Field.barnetSøknadenGjelder]: '',
    [Field.harGodkjentVilkår]: false,
    [Field.harBekreftetOpplysninger]: false,
    [Field.søkersRelasjonTilBarnet]: '',
    [Field.søknadenGjelderEtAnnetBarn]: false,
    [Field.legeerklæring]: [],
    [Field.ansettelsesforhold]: []
};
