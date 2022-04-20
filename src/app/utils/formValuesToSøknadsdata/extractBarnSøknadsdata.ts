import { BarnRelasjon } from '../../types';
import { OmBarnetFormData } from '../../types/SøknadFormData';
import { OmBarnetSøknadsdata } from '../../types/søknadsdata/omBarnetSøknadsdata';

export const extractBarnSøknadsdata = (values: OmBarnetFormData): OmBarnetSøknadsdata | undefined => {
    if (values.barnetSøknadenGjelder) {
        return {
            type: 'registrerteBarn',
            aktørId: values.barnetSøknadenGjelder,
        };
    }

    if (!values.barnetSøknadenGjelder) {
        if (values.barnetsFødselsnummer) {
            return {
                type: 'annetBarn',
                barnetsNavn: values.barnetsNavn,
                barnetsFødselsnummer: values.barnetsFødselsnummer,
                relasjonTilBarnet: values.relasjonTilBarnet,
                relasjonTilBarnetBeskrivelse:
                    values.relasjonTilBarnet === BarnRelasjon.ANNET ? values.relasjonTilBarnetBeskrivelse : undefined,
            };
        } else if (values.barnetsFødselsdato && values.årsakManglerIdentitetsnummer) {
            return {
                type: 'annetBarnUtenFnr',
                barnetsNavn: values.barnetsNavn,
                årsakManglerIdentitetsnummer: values.årsakManglerIdentitetsnummer,
                barnetsFødselsdato: values.barnetsFødselsdato,
                relasjonTilBarnet: values.relasjonTilBarnet,
                relasjonTilBarnetBeskrivelse:
                    values.relasjonTilBarnet === BarnRelasjon.ANNET ? values.relasjonTilBarnetBeskrivelse : undefined,
            };
        }
        return undefined;
    }

    return undefined;
};
