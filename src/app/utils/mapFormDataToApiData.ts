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
    harGodkjentVilkår,
    søkersRelasjonTilBarnet,
    ansettelsesforhold,
    periodeFra,
    periodeTil,
    legeerklæring,
    harBoddUtenforNorgeSiste12Mnd,
    skalBoUtenforNorgeNeste12Mnd,
    finnesDetEnAnnenSøker,
    grad
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
        finnes_det_en_annen_søker: finnesDetEnAnnenSøker === YesOrNo.YES,
        grad
    };
};
