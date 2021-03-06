import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/mapVirksomhetToApiData';
import {
    ArbeidsforholdAnsattApi,
    ArbeidsforholdType,
    BarnToSendToApi,
    PleiepengesøknadApiData,
} from '../types/PleiepengesøknadApiData';
import { ArbeidsforholdAnsatt, BarnRelasjon, PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import appSentryLogger from './appSentryLogger';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { filterAndMapAttachmentsToApiFormat } from './formToApiMaps/attachmentsToApiData';
import { mapArbeidsforholdToApiData } from './formToApiMaps/mapArbeidsforholdToApiData';
import { mapBarnToApiData } from './formToApiMaps/mapBarnToApiData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapFrilansToApiData } from './formToApiMaps/mapFrilansToApiData';
import { mapTilsynsordningToApiData } from './formToApiMaps/mapTilsynsordningToApiData';
import { mapUtenlandsoppholdIPeriodenToApiData } from './formToApiMaps/mapUtenlandsoppholdIPeriodenToApiData';
import { skalBrukerSvarePåBeredskapOgNattevåk } from './stepUtils';
import { brukerSkalBekrefteOmsorgForBarnet, brukerSkalBeskriveOmsorgForBarnet } from './tidsromUtils';

export const getValidSpråk = (locale?: any): Locale => {
    const loc = typeof locale === 'string' ? locale : 'nb';
    try {
        switch (loc.toLowerCase()) {
            case 'nn':
                return 'nn';
            default:
                return 'nb';
        }
    } catch {
        appSentryLogger.logInfo('Fallback on getValidSpråk', loc);
        return 'nb';
    }
};

export const getOrganisasjonerApiData = (arbeidsforhold: ArbeidsforholdAnsatt[]): ArbeidsforholdAnsattApi[] => {
    const organisasjoner: ArbeidsforholdAnsattApi[] = [];
    arbeidsforhold
        .filter((a) => a.erAnsattIPerioden === YesOrNo.YES)
        .forEach((forhold) => {
            const arbeidsforholdApiData = mapArbeidsforholdToApiData(forhold, ArbeidsforholdType.ANSATT);
            if (arbeidsforholdApiData) {
                organisasjoner.push({
                    ...arbeidsforholdApiData,
                    navn: forhold.navn,
                    organisasjonsnummer: forhold.organisasjonsnummer,
                });
            } else {
                throw new Error('Invalid arbeidsforhold');
            }
        });
    return organisasjoner;
};

export const mapFormDataToApiData = (
    formData: PleiepengesøknadFormData,
    barn: BarnReceivedFromApi[],
    locale: Locale = 'nb'
): PleiepengesøknadApiData | undefined => {
    const {
        barnetsNavn,
        barnetsFødselsnummer,
        barnetSøknadenGjelder,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        arbeidsforhold,
        legeerklæring,
        harBoddUtenforNorgeSiste12Mnd,
        skalBoUtenforNorgeNeste12Mnd,
        utenlandsoppholdNeste12Mnd,
        utenlandsoppholdSiste12Mnd,
        harMedsøker,
        samtidigHjemme,
        omsorgstilbud,
        harBeredskap,
        harBeredskap_ekstrainfo,
        harNattevåk,
        harNattevåk_ekstrainfo,
        skalOppholdeSegIUtlandetIPerioden,
        utenlandsoppholdIPerioden,
        ferieuttakIPerioden,
        skalTaUtFerieIPerioden,
        harHattInntektSomFrilanser,
        selvstendig_harHattInntektSomSN,
        selvstendig_harFlereVirksomheter,
        selvstendig_virksomhet,
        relasjonTilBarnet,
        relasjonTilBarnetBeskrivelse,
    } = formData;

    const periodeFra = datepickerUtils.getDateFromDateString(formData.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(formData.periodeTil);
    const organisasjoner = getOrganisasjonerApiData(arbeidsforhold);

    if (periodeFra && periodeTil) {
        try {
            const barnObject: BarnToSendToApi = mapBarnToApiData(
                barn,
                barnetsNavn,
                barnetsFødselsnummer,
                barnetSøknadenGjelder
            );

            const gjelderAnnetBarn = barnObject.aktørId === null;
            const sprak = getValidSpråk(locale);

            const apiData: PleiepengesøknadApiData = {
                newVersion: true,
                språk: sprak,
                barn: barnObject,
                barnRelasjon: gjelderAnnetBarn ? relasjonTilBarnet : undefined,
                barnRelasjonBeskrivelse:
                    gjelderAnnetBarn && relasjonTilBarnet === BarnRelasjon.ANNET
                        ? relasjonTilBarnetBeskrivelse
                        : undefined,
                arbeidsgivere: {
                    organisasjoner,
                },
                medlemskap: {
                    harBoddIUtlandetSiste12Mnd: harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
                    skalBoIUtlandetNeste12Mnd: skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
                    utenlandsoppholdSiste12Mnd:
                        harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES
                            ? utenlandsoppholdSiste12Mnd.map((o) => mapBostedUtlandToApiData(o, sprak))
                            : [],
                    utenlandsoppholdNeste12Mnd:
                        skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES
                            ? utenlandsoppholdNeste12Mnd.map((o) => mapBostedUtlandToApiData(o, sprak))
                            : [],
                },
                fraOgMed: formatDateToApiFormat(periodeFra),
                tilOgMed: formatDateToApiFormat(periodeTil),
                vedlegg: filterAndMapAttachmentsToApiFormat(legeerklæring),
                harMedsøker: harMedsøker === YesOrNo.YES,
                harBekreftetOpplysninger,
                harForståttRettigheterOgPlikter,
                harVærtEllerErVernepliktig: formData.harVærtEllerErVernepliktig
                    ? formData.harVærtEllerErVernepliktig === YesOrNo.YES
                    : undefined,
                andreYtelserFraNAV:
                    isFeatureEnabled(Feature.ANDRE_YTELSER) && formData.mottarAndreYtelser === YesOrNo.YES
                        ? formData.andreYtelser
                        : [],
                harHattInntektSomFrilanser: harHattInntektSomFrilanser === YesOrNo.YES,
                frilans: mapFrilansToApiData(formData),
                harHattInntektSomSelvstendigNæringsdrivende: selvstendig_harHattInntektSomSN === YesOrNo.YES,
                selvstendigVirksomheter:
                    selvstendig_harHattInntektSomSN === YesOrNo.YES && selvstendig_virksomhet !== undefined
                        ? [
                              mapVirksomhetToVirksomhetApiData(
                                  locale,
                                  selvstendig_virksomhet,
                                  selvstendig_harFlereVirksomheter === YesOrNo.YES
                              ),
                          ]
                        : [],
            };

            if (isFeatureEnabled(Feature.TOGGLE_BEKREFT_OMSORG)) {
                const skalBekrefteOmsorgForBarnet = brukerSkalBekrefteOmsorgForBarnet(formData, barn);
                const skalBeskriveOmsorgForBarnet = brukerSkalBeskriveOmsorgForBarnet(formData, barn);
                if (skalBekrefteOmsorgForBarnet) {
                    apiData.skalBekrefteOmsorg = true;
                    apiData.skalPassePåBarnetIHelePerioden = formData.skalPassePåBarnetIHelePerioden === YesOrNo.YES;
                    if (skalBeskriveOmsorgForBarnet) {
                        apiData.beskrivelseOmsorgsrollen = formData.beskrivelseOmsorgsrolleIPerioden;
                    }
                }
            }

            if (isFeatureEnabled(Feature.TOGGLE_UTENLANDSOPPHOLD_I_PERIODEN)) {
                apiData.utenlandsoppholdIPerioden = {
                    skalOppholdeSegIUtlandetIPerioden: skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES,
                    opphold:
                        skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && utenlandsoppholdIPerioden
                            ? utenlandsoppholdIPerioden.map((o) => mapUtenlandsoppholdIPeriodenToApiData(o, sprak))
                            : [],
                };
            }

            apiData.ferieuttakIPerioden = {
                skalTaUtFerieIPerioden: skalTaUtFerieIPerioden === YesOrNo.YES,
                ferieuttak:
                    skalTaUtFerieIPerioden === YesOrNo.YES && ferieuttakIPerioden
                        ? ferieuttakIPerioden.map((uttak) => ({
                              fraOgMed: formatDateToApiFormat(uttak.fom),
                              tilOgMed: formatDateToApiFormat(uttak.tom),
                          }))
                        : [],
            };

            apiData.harHattInntektSomSelvstendigNæringsdrivende =
                formData.selvstendig_harHattInntektSomSN === YesOrNo.YES;

            apiData.selvstendigArbeidsforhold = formData.selvstendig_arbeidsforhold
                ? mapArbeidsforholdToApiData(formData.selvstendig_arbeidsforhold, ArbeidsforholdType.SELVSTENDIG)
                : undefined;

            apiData.samtidigHjemme = harMedsøker === YesOrNo.YES ? samtidigHjemme === YesOrNo.YES : undefined;

            if (omsorgstilbud !== undefined) {
                apiData.omsorgstilbud = mapTilsynsordningToApiData(omsorgstilbud);
                const inkluderNattevåkOgBeredskap = skalBrukerSvarePåBeredskapOgNattevåk(formData);
                if (inkluderNattevåkOgBeredskap && omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES) {
                    apiData.nattevåk = {
                        harNattevåk: harNattevåk === YesOrNo.YES,
                        tilleggsinformasjon: harNattevåk_ekstrainfo,
                    };
                    apiData.beredskap = {
                        beredskap: harBeredskap === YesOrNo.YES,
                        tilleggsinformasjon: harBeredskap_ekstrainfo,
                    };
                }
            }
            return apiData;
        } catch (e) {
            appSentryLogger.logError('mapFormDataToApiData failed', e);
            return undefined;
        }
    } else {
        appSentryLogger.logError(
            'mapFormDataToApiData failed - empty periode',
            JSON.stringify({ periodeFra, periodeTil })
        );
        return undefined;
    }
};
