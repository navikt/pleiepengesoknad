import { formatDate } from './dateUtils';
import {
    PleiepengesøknadFormData,
    AnsettelsesforholdForm,
    Tilsynsordning,
    TilsynVetIkkeHvorfor,
    AnsettelsesforholdSkalJobbeSvar
} from '../types/PleiepengesøknadFormData';
import {
    BarnToSendToApi,
    PleiepengesøknadApiData,
    AnsettelsesforholdApi,
    TilsynsordningApi,
    AnsettelsesforholdApiNei,
    AnsettelsesforholdApiRedusert,
    AnsettelsesforholdApiSomVanlig
} from '../types/PleiepengesøknadApiData';
import { attachmentUploadHasFailed } from './attachmentUtils';
import { YesOrNo } from '../types/YesOrNo';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { formatName } from './personUtils';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import { Locale } from 'app/types/Locale';
import { timeToIso8601Duration } from './timeUtils';
import { calcRedusertProsentFromRedusertTimer } from './ansettelsesforholdUtils';

export const mapFormDataToApiData = (
    {
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
        samtidigHjemme,
        grad,
        dagerPerUkeBorteFraJobb,
        tilsynsordning,
        harBeredskap,
        harBeredskap_ekstrainfo,
        harNattevåk,
        harNattevåk_borteFraJobb,
        harNattevåk_ekstrainfo
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

    const apiData: PleiepengesøknadApiData = {
        sprak,
        barn: barnObject,
        relasjon_til_barnet: barnObject.aktoer_id ? null : søkersRelasjonTilBarnet,
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
        har_bekreftet_opplysninger: harBekreftetOpplysninger,
        har_forstatt_rettigheter_og_plikter: harForståttRettigheterOgPlikter
    };

    if (isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD) === false && grad !== undefined) {
        apiData.grad = +grad;
    }

    if (isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD) === true && apiData.har_medsoker === true) {
        apiData.samtidig_hjemme = samtidigHjemme === YesOrNo.YES;
    }

    if (isFeatureEnabled(Feature.TOGGLE_TILSYN) === true && tilsynsordning) {
        apiData.tilsynsordning = mapTilsynsordningToApiData(tilsynsordning);
        if (
            tilsynsordning.skalBarnHaTilsyn === YesOrNo.YES ||
            tilsynsordning.skalBarnHaTilsyn === YesOrNo.DO_NOT_KNOW
        ) {
            apiData.nattevaak = {
                har_nattevaak: harNattevåk === YesOrNo.YES,
                borte_fra_jobb: harNattevåk_borteFraJobb === YesOrNo.YES,
                tilleggsinformasjon: harNattevåk_ekstrainfo
            };
            apiData.beredskap = {
                i_beredskap: harBeredskap === YesOrNo.YES,
                tilleggsinformasjon: harBeredskap_ekstrainfo
            };
        }
    }

    return apiData;
};

const mapAnsettelsesforholdTilApiData = (ansettelsesforhold: AnsettelsesforholdForm): AnsettelsesforholdApi => {
    const {
        skalJobbe,
        timerEllerProsent,
        jobberNormaltTimer,
        skalJobbeTimer,
        skalJobbeProsent,
        navn,
        organisasjonsnummer
    } = ansettelsesforhold;

    const orgInfo = { navn, organisasjonsnummer };
    if (isFeatureEnabled(Feature.TOGGLE_FJERN_GRAD) === false) {
        return orgInfo;
    }

    if (skalJobbe === AnsettelsesforholdSkalJobbeSvar.redusert) {
        if (jobberNormaltTimer === undefined) {
            throw new Error('invalid data: missing jobberNormaltTimer');
        }
        const redusertForhold: AnsettelsesforholdApiRedusert = {
            ...orgInfo,
            skal_jobbe: 'redusert',
            jobber_normalt_timer: jobberNormaltTimer,
            ...(timerEllerProsent === 'timer' && skalJobbeTimer
                ? {
                      skal_jobbe_timer: skalJobbeTimer,
                      skal_jobbe_prosent: calcRedusertProsentFromRedusertTimer(jobberNormaltTimer, skalJobbeTimer)
                  }
                : {
                      skal_jobbe_prosent: skalJobbeProsent
                  })
        };
        return redusertForhold;
    }
    if (skalJobbe === AnsettelsesforholdSkalJobbeSvar.nei) {
        const forhold: AnsettelsesforholdApiNei = {
            ...orgInfo,
            skal_jobbe: 'nei',
            skal_jobbe_prosent: 0
        };
        return forhold;
    }
    const forholdSomVanlig: AnsettelsesforholdApiSomVanlig = {
        ...orgInfo,
        skal_jobbe: 'ja',
        skal_jobbe_prosent: 100
    };
    return forholdSomVanlig;
};

export const mapTilsynsordningToApiData = (tilsynsordning: Tilsynsordning): TilsynsordningApi | undefined => {
    const { ja, vetIkke, skalBarnHaTilsyn } = tilsynsordning;
    if (YesOrNo.YES === skalBarnHaTilsyn && ja) {
        const { ekstrainfo, tilsyn } = ja;
        const dager = tilsyn
            ? {
                  mandag: tilsyn.mandag ? timeToIso8601Duration(tilsyn.mandag) : undefined,
                  tirsdag: tilsyn.tirsdag ? timeToIso8601Duration(tilsyn.tirsdag) : undefined,
                  onsdag: tilsyn.onsdag ? timeToIso8601Duration(tilsyn.onsdag) : undefined,
                  torsdag: tilsyn.torsdag ? timeToIso8601Duration(tilsyn.torsdag) : undefined,
                  fredag: tilsyn.fredag ? timeToIso8601Duration(tilsyn.fredag) : undefined
              }
            : undefined;
        return {
            svar: 'ja',
            ja: {
                ...dager,
                tilleggsinformasjon: ekstrainfo
            }
        };
    }
    if (YesOrNo.DO_NOT_KNOW === skalBarnHaTilsyn && vetIkke) {
        return {
            svar: 'vet_ikke',
            vet_ikke: {
                svar: vetIkke.hvorfor,
                ...(vetIkke.hvorfor === TilsynVetIkkeHvorfor.annet
                    ? {
                          annet: vetIkke.ekstrainfo
                      }
                    : undefined)
            }
        };
    }
    if (YesOrNo.NO === skalBarnHaTilsyn) {
        return {
            svar: 'nei'
        };
    }
    return undefined;
};
