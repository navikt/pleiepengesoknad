import { formatDate } from './dateUtils';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { Barn, PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';

export const mapFormDataToApiData = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetsForeløpigeFødselsnummerEllerDNummer,
    barnetSøknadenGjelder,
    harBekreftetOpplysninger,
    harGodkjentVilkår,
    søkersRelasjonTilBarnet,
    ansettelsesforhold,
    periodeFra,
    periodeTil,
    legeerklæring
}: PleiepengesøknadFormData): PleiepengesøknadApiData => {
    const fnrObject: Partial<Barn> = {};
    if (barnetsFødselsnummer) {
        fnrObject.fodselsnummer = barnetsFødselsnummer;
    } else if (barnetsForeløpigeFødselsnummerEllerDNummer) {
        fnrObject.alternativ_id = barnetsForeløpigeFødselsnummerEllerDNummer;
    }

    return {
        barn: {
            navn: barnetsNavn,
            ...fnrObject
        },
        relasjon_til_barnet: søkersRelasjonTilBarnet,
        ansettelsesforhold: {
            organisasjoner: ansettelsesforhold
        },
        fra_og_med: formatDate(periodeFra!),
        til_og_med: formatDate(periodeTil!),
        vedlegg: legeerklæring.filter(({ uploaded }) => uploaded === true).map(({ url }) => url!)
    };
};
