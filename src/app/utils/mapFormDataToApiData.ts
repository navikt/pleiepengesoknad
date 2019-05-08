import { formatDate } from './dateUtils';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { Barn, PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { attachmentUploadHasFailed } from './attachmentUtils';
import { YesOrNo } from '../types/YesOrNo';

export const mapFormDataToApiData = ({
    barnetsNavn,
    barnetsFødselsnummer,
    barnetsForeløpigeFødselsnummerEllerDNummer,
    barnetSøknadenGjelder,
    harBekreftetOpplysninger,
    harForståttRettigheterOgPlikter,
    søkersRelasjonTilBarnet,
    ansettelsesforhold,
    periodeFra,
    periodeTil,
    legeerklæring,
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
    harMedsøker,
    grad
}: PleiepengesøknadFormData): PleiepengesøknadApiData => {
    const fnrObject: Barn = { navn: null, fodselsnummer: null, alternativ_id: null };
    if (barnetsFødselsnummer) {
        fnrObject.fodselsnummer = barnetsFødselsnummer;
    } else if (barnetsForeløpigeFødselsnummerEllerDNummer) {
        fnrObject.alternativ_id = barnetsForeløpigeFødselsnummerEllerDNummer;
    }

    return {
        barn: {
            navn: barnetsNavn !== '' ? barnetsNavn : null,
            fodselsnummer: fnrObject.fodselsnummer !== '' ? fnrObject.fodselsnummer : null,
            alternativ_id: fnrObject.alternativ_id !== '' ? fnrObject.alternativ_id : null
        },
        relasjon_til_barnet: søkersRelasjonTilBarnet,
        arbeidsgivere: {
            organisasjoner: ansettelsesforhold
        },
        medlemskap: {
            har_bodd_i_utlandet_siste_12_mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
            skal_bo_i_utlandet_neste_12_mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
        },
        fra_og_med: formatDate(periodeFra!),
        til_og_med: formatDate(periodeTil!),
        vedlegg: legeerklæring.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!),
        har_medsoker: harMedsøker === YesOrNo.YES,
        grad: +grad,
        har_bekreftet_opplysninger: harBekreftetOpplysninger,
        har_forstatt_rettigheter_og_plikter: harForståttRettigheterOgPlikter
    };
};
