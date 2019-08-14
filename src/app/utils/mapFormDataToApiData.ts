import { formatDate } from './dateUtils';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { BarnToSendToApi, PleiepengesøknadApiData, AnsettelsesforholdApi } from '../types/PleiepengesøknadApiData';
import { attachmentUploadHasFailed } from './attachmentUtils';
import { YesOrNo } from '../types/YesOrNo';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { formatName } from './personUtils';
import { BarnReceivedFromApi, Ansettelsesforhold } from '../types/Søkerdata';
import { Locale } from 'app/types/Locale';
import { calculateRedusertArbeidsuke } from './ansettelsesforholdUtils';

export const mapFormDataToApiData = (
    {
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsForeløpigeFødselsnummerEllerDNummer,
        søknadenGjelderEtAnnetBarn,
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
    }: PleiepengesøknadFormData,
    barn: BarnReceivedFromApi[],
    sprak: Locale
): PleiepengesøknadApiData => {
    const barnObject: BarnToSendToApi = { navn: null, fodselsnummer: null, alternativ_id: null, aktoer_id: null };
    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktoer_id === barnetSøknadenGjelder);
        const { fornavn, etternavn, mellomnavn, aktoer_id } = barnChosenFromList!;
        barnObject.aktoer_id = aktoer_id;
        barnObject.navn = formatName(fornavn, etternavn, mellomnavn);
    } else {
        barnObject.navn = barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null;
        if (barnetsFødselsnummer) {
            barnObject.fodselsnummer = barnetsFødselsnummer;
        } else if (barnetsForeløpigeFødselsnummerEllerDNummer) {
            barnObject.alternativ_id = barnetsForeløpigeFødselsnummerEllerDNummer;
        }
    }

    return {
        sprak,
        barn: barnObject,
        relasjon_til_barnet:
            isFeatureEnabled(Feature.HENT_BARN_FEATURE) && barnObject.aktoer_id ? null : søkersRelasjonTilBarnet,
        arbeidsgivere: {
            organisasjoner: ansettelsesforhold.map((forhold) => mapAnsettelsesforholdTilApiData(forhold))
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

const mapAnsettelsesforholdTilApiData = (ansettelsesforhold: Ansettelsesforhold): AnsettelsesforholdApi => {
    const { redusert_arbeidsuke, pstEllerTimer, skalArbeide, normal_arbeidsuke, ...rest } = ansettelsesforhold;
    if (normal_arbeidsuke === undefined || redusert_arbeidsuke === undefined || pstEllerTimer === undefined) {
        return rest;
    }

    const forhold: AnsettelsesforholdApi = {
        ...rest,
        normal_arbeidsuke,
        redusert_arbeidsuke: skalArbeide
            ? calculateRedusertArbeidsuke(normal_arbeidsuke, redusert_arbeidsuke, pstEllerTimer)
            : 0
    };
    return forhold;
};
