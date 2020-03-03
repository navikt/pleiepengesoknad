import { mapVirksomhetToVirksomhetApiData } from 'common/forms/virksomhet/mapVirksomhetToApiData';
import { Locale } from 'common/types/Locale';
import { YesOrNo } from 'common/types/YesOrNo';
import { attachmentUploadHasFailed } from 'common/utils/attachmentUtils';
import { formatDateToApiFormat } from 'common/utils/dateUtils';
import { BarnToSendToApi, PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { mapArbeidsforholdToApiData } from './formToApiMaps/mapArbeidsforholdToApiData';
import { mapBarnToApiData } from './formToApiMaps/mapBarnToApiData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapFrilansToApiData } from './formToApiMaps/mapFrilansToApiData';
import { mapTilsynsordningToApiData } from './formToApiMaps/mapTilsynsordningToApiData';
import {
    mapUtenlandsoppholdIPeriodenToApiData
} from './formToApiMaps/mapUtenlandsoppholdIPeriodenToApiData';

export const mapFormDataToApiData = (
    formData: PleiepengesøknadFormData,
    barn: BarnReceivedFromApi[],
    sprak: Locale = 'nb'
): PleiepengesøknadApiData => {
    const {
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsFødselsdato,
        barnetSøknadenGjelder,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        arbeidsforhold,
        periodeFra,
        periodeTil,
        legeerklæring,
        harBoddUtenforNorgeSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
        utenlandsoppholdSiste12Mnd,
        harMedsøker,
        samtidigHjemme,
        tilsynsordning,
        harBeredskap,
        harBeredskap_ekstrainfo,
        harNattevåk,
        harNattevåk_ekstrainfo,
        skalOppholdeSegIUtlandetIPerioden,
        utenlandsoppholdIPerioden,
        ferieuttakIPerioden,
        skalTaUtFerieIPerioden,
        harHattInntektSomFrilanser
    } = formData;
    const barnObject: BarnToSendToApi = mapBarnToApiData(
        barn,
        barnetsNavn,
        barnetsFødselsnummer,
        barnetsFødselsdato,
        barnetSøknadenGjelder
    );

    const apiData: PleiepengesøknadApiData = {
        new_version: true,
        sprak: (sprak as any) === 'en' ? 'nn' : sprak,
        barn: barnObject,
        arbeidsgivere: {
            organisasjoner: arbeidsforhold
                .filter((a) => a.erAnsattIPerioden === YesOrNo.YES)
                .map((forhold) => mapArbeidsforholdToApiData(forhold))
        },
        medlemskap: {
            har_bodd_i_utlandet_siste_12_mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
            skal_bo_i_utlandet_neste_12_mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
            utenlandsopphold_siste_12_mnd:
                harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdSiste12Mnd.map((o) => mapBostedUtlandToApiData(o, sprak))
                    : [],
            utenlandsopphold_neste_12_mnd:
                skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdNeste12Mnd.map((o) => mapBostedUtlandToApiData(o, sprak))
                    : []
        },
        fra_og_med: formatDateToApiFormat(periodeFra!),
        til_og_med: formatDateToApiFormat(periodeTil!),
        vedlegg: legeerklæring.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!),
        har_medsoker: harMedsøker === YesOrNo.YES,
        har_bekreftet_opplysninger: harBekreftetOpplysninger,
        har_forstatt_rettigheter_og_plikter: harForståttRettigheterOgPlikter
    };

    if (isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN)) {
        apiData.utenlandsopphold_i_perioden = {
            skal_oppholde_seg_i_utlandet_i_perioden: skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES,
            opphold:
                skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && utenlandsoppholdIPerioden
                    ? utenlandsoppholdIPerioden.map((o) => mapUtenlandsoppholdIPeriodenToApiData(o, sprak))
                    : []
        };
    }

    if (isFeatureEnabled(Feature.TOGGLE_FERIEUTTAK)) {
        apiData.ferieuttak_i_perioden = {
            skal_ta_ut_ferie_i_periode: skalTaUtFerieIPerioden === YesOrNo.YES,
            ferieuttak:
                skalTaUtFerieIPerioden === YesOrNo.YES && ferieuttakIPerioden
                    ? ferieuttakIPerioden.map((uttak) => ({
                          fra_og_med: formatDateToApiFormat(uttak.fom),
                          til_og_med: formatDateToApiFormat(uttak.tom)
                      }))
                    : []
        };
    }

    if (isFeatureEnabled(Feature.TOGGLE_FRILANS)) {
        apiData.har_hatt_inntekt_som_frilanser = harHattInntektSomFrilanser === YesOrNo.YES;
        apiData.frilans = mapFrilansToApiData(formData);
    }

    if (isFeatureEnabled(Feature.TOGGLE_SELVSTENDIG) && formData.selvstendig_virksomheter) {
        const harHattInntektSomSn = formData.selvstendig_harHattInntektSomSN === YesOrNo.YES;
        apiData.har_hatt_inntekt_som_selvstendig_naringsdrivende = harHattInntektSomSn;
        if (harHattInntektSomSn) {
            apiData.selvstendig_virksomheter = formData.selvstendig_virksomheter.map(mapVirksomhetToVirksomhetApiData);
        }
    }

    apiData.samtidig_hjemme = harMedsøker === YesOrNo.YES ? samtidigHjemme === YesOrNo.YES : undefined;

    if (tilsynsordning !== undefined) {
        apiData.tilsynsordning = mapTilsynsordningToApiData(tilsynsordning);
        if (
            tilsynsordning.skalBarnHaTilsyn === YesOrNo.YES ||
            tilsynsordning.skalBarnHaTilsyn === YesOrNo.DO_NOT_KNOW
        ) {
            apiData.nattevaak = {
                har_nattevaak: harNattevåk === YesOrNo.YES,
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
