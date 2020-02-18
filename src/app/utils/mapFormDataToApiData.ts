import { formatDateToApiFormat } from 'common/utils/dateUtils';
import {
    PleiepengesøknadFormData,
    Arbeidsforhold,
    Tilsynsordning,
    TilsynVetIkkeHvorfor,
    ArbeidsforholdSkalJobbeSvar
} from '../types/PleiepengesøknadFormData';
import {
    BarnToSendToApi,
    PleiepengesøknadApiData,
    ArbeidsforholdApi,
    TilsynsordningApi,
    ArbeidsforholdApiNei,
    ArbeidsforholdApiRedusert,
    ArbeidsforholdApiSomVanlig,
    ArbeidsforholdApiVetIkke,
    BostedUtlandApiData,
    UtenlandsoppholdUtenforEøsIPeriodenApiData,
    FrilansApiData
} from '../types/PleiepengesøknadApiData';
import { attachmentUploadHasFailed } from 'common/utils/attachmentUtils';
import { YesOrNo } from 'common/types/YesOrNo';
import { formatName } from 'common/utils/personUtils';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import { Locale } from 'common/types/Locale';
import { timeToIso8601Duration } from 'common/utils/timeUtils';
import { calcRedusertProsentFromRedusertTimer } from './arbeidsforholdUtils';
import { getCountryName } from 'common/components/country-select/CountrySelect';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { countryIsMemberOfEøsOrEfta } from 'common/utils/countryUtils';
import { isFeatureEnabled, Feature } from './featureToggleUtils';

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
                .map((forhold) => mapArbeidsforholdTilApiData(forhold))
        },
        medlemskap: {
            har_bodd_i_utlandet_siste_12_mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
            skal_bo_i_utlandet_neste_12_mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
            utenlandsopphold_siste_12_mnd:
                harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdSiste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
                    : [],
            utenlandsopphold_neste_12_mnd:
                skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
                    ? utenlandsoppholdNeste12Mnd.map((o) => mapUtenlandsoppholdTilApiData(o, sprak))
                    : []
        },
        fra_og_med: formatDateToApiFormat(periodeFra!),
        til_og_med: formatDateToApiFormat(periodeTil!),
        vedlegg: legeerklæring.filter((attachment) => !attachmentUploadHasFailed(attachment)).map(({ url }) => url!),
        har_medsoker: harMedsøker === YesOrNo.YES,
        har_bekreftet_opplysninger: harBekreftetOpplysninger,
        har_forstatt_rettigheter_og_plikter: harForståttRettigheterOgPlikter,
        har_hatt_inntekt_som_frilanser: harHattInntektSomFrilanser === YesOrNo.YES
    };

    if (isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD)) {
        apiData.utenlandsopphold_i_perioden = {
            skal_oppholde_seg_i_utlandet_i_perioden: skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES,
            opphold:
                skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES
                    ? utenlandsoppholdIPerioden.map((o) => {
                          const erUtenforEØS: boolean = countryIsMemberOfEøsOrEfta(o.landkode) === false;
                          if (erUtenforEØS && o.årsak) {
                              const periodeopphold: UtenlandsoppholdUtenforEøsIPeriodenApiData = {
                                  ...mapUtenlandsoppholdTilApiData(o, sprak),
                                  er_utenfor_eos: erUtenforEØS,
                                  er_barnet_innlagt: o.erBarnetInnlagt === YesOrNo.YES,
                                  arsak: o.erBarnetInnlagt === YesOrNo.YES ? o.årsak : null
                              };
                              return periodeopphold;
                          } else {
                              return mapUtenlandsoppholdTilApiData(o, sprak);
                          }
                      })
                    : []
        };
    }

    if (isFeatureEnabled(Feature.TOGGLE_FERIEUTTAK)) {
        apiData.ferieuttak_i_perioden = {
            skal_ta_ut_ferie_i_periode: skalTaUtFerieIPerioden === YesOrNo.YES,
            ferieuttak:
                skalTaUtFerieIPerioden === YesOrNo.YES
                    ? ferieuttakIPerioden.map((uttak) => ({
                          fra_og_med: formatDateToApiFormat(uttak.fom),
                          til_og_med: formatDateToApiFormat(uttak.tom)
                      }))
                    : []
        };
    }

    if (isFeatureEnabled(Feature.TOGGLE_FRILANS) && apiData.har_hatt_inntekt_som_frilanser) {
        apiData.frilans = mapFrilansToApiData(formData);
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

export const mapBarnToApiData = (
    barn: BarnReceivedFromApi[],
    barnetsNavn: string,
    barnetsFødselsnummer: string | undefined,
    barnetsFødselsdato: Date | undefined,
    barnetSøknadenGjelder: string | undefined
): BarnToSendToApi => {
    if (barnetSøknadenGjelder) {
        const barnChosenFromList = barn.find((currentBarn) => currentBarn.aktoer_id === barnetSøknadenGjelder)!;
        const { fornavn, etternavn, mellomnavn, aktoer_id } = barnChosenFromList;
        return {
            navn: formatName(fornavn, etternavn, mellomnavn),
            fodselsnummer: null,
            aktoer_id,
            fodselsdato: formatDateToApiFormat(barnChosenFromList.fodselsdato)
        };
    } else {
        return {
            navn: barnetsNavn && barnetsNavn !== '' ? barnetsNavn : null,
            fodselsnummer: barnetsFødselsnummer || null,
            aktoer_id: null,
            fodselsdato: barnetsFødselsdato !== undefined ? formatDateToApiFormat(barnetsFødselsdato) : null
        };
    }
};

const mapFrilansToApiData = (formData: PleiepengesøknadFormData): FrilansApiData | undefined => {
    const {
        frilans_harHattOppdragForFamilieVenner,
        frilans_jobberFortsattSomFrilans,
        frilans_harInntektSomFosterforelder,
        frilans_startdato,
        frilans_oppdrag
    } = formData;

    if (
        frilans_harHattOppdragForFamilieVenner &&
        frilans_jobberFortsattSomFrilans &&
        frilans_harInntektSomFosterforelder &&
        frilans_startdato &&
        frilans_oppdrag
    ) {
        const data: FrilansApiData = {
            har_hatt_oppdrag_for_familie: frilans_harHattOppdragForFamilieVenner === YesOrNo.YES,
            har_hatt_inntekt_som_fosterforelder: frilans_harInntektSomFosterforelder === YesOrNo.YES,
            startdato: formatDateToApiFormat(frilans_startdato),
            jobber_fortsatt_som_frilans: frilans_harInntektSomFosterforelder === YesOrNo.YES,
            oppdrag: frilans_oppdrag.map(({ fom, tom, erPågående, arbeidsgiverNavn }) => {
                return {
                    arbeidsgivernavn: arbeidsgiverNavn,
                    fra_og_med: formatDateToApiFormat(fom),
                    til_og_med: erPågående || tom === undefined ? null : formatDateToApiFormat(tom),
                    er_pagaende: erPågående
                };
            })
        };
        return data;
    }
    return undefined;
};

const mapArbeidsforholdTilApiData = (arbeidsforhold: Arbeidsforhold): ArbeidsforholdApi => {
    const {
        skalJobbe,
        timerEllerProsent,
        jobberNormaltTimer,
        skalJobbeTimer,
        skalJobbeProsent,
        navn,
        organisasjonsnummer
    } = arbeidsforhold;

    const orgInfo = { navn, organisasjonsnummer };
    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert) {
        if (jobberNormaltTimer === undefined) {
            throw new Error('invalid data: missing jobberNormaltTimer');
        }
        const redusertForhold: ArbeidsforholdApiRedusert = {
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
    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke) {
        if (jobberNormaltTimer === undefined) {
            throw new Error('invalid data: missing jobberNormaltTimer');
        }
        const vetIkkeForhold: ArbeidsforholdApiVetIkke = {
            ...orgInfo,
            skal_jobbe: 'vet_ikke',
            jobber_normalt_timer: jobberNormaltTimer
        };
        return vetIkkeForhold;
    }
    if (skalJobbe === ArbeidsforholdSkalJobbeSvar.nei) {
        const forhold: ArbeidsforholdApiNei = {
            ...orgInfo,
            skal_jobbe: 'nei',
            skal_jobbe_prosent: 0
        };
        return forhold;
    }
    const forholdSomVanlig: ArbeidsforholdApiSomVanlig = {
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

const mapUtenlandsoppholdTilApiData = (opphold: Utenlandsopphold, locale: string): BostedUtlandApiData => ({
    landnavn: getCountryName(opphold.landkode, locale),
    landkode: opphold.landkode,
    fra_og_med: formatDateToApiFormat(opphold.fom),
    til_og_med: formatDateToApiFormat(opphold.tom)
});
