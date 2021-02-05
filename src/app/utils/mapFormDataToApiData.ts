import { mapVirksomhetToVirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/mapVirksomhetToApiData';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { attachmentUploadHasFailed } from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { BarnToSendToApi, PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import appSentryLogger from './appSentryLogger';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { mapArbeidsforholdToApiData } from './formToApiMaps/mapArbeidsforholdToApiData';
import { mapBarnToApiData } from './formToApiMaps/mapBarnToApiData';
import { mapBostedUtlandToApiData } from './formToApiMaps/mapBostedUtlandToApiData';
import { mapFrilansToApiData } from './formToApiMaps/mapFrilansToApiData';
import { mapTilsynsordningToApiData } from './formToApiMaps/mapTilsynsordningToApiData';
import { mapUtenlandsoppholdIPeriodenToApiData } from './formToApiMaps/mapUtenlandsoppholdIPeriodenToApiData';
import { erPeriodeOver8Uker } from './søkerOver8UkerUtils';
import { brukerSkalBekrefteOmsorgForBarnet, brukerSkalBeskriveOmsorgForBarnet } from './tidsromUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';

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

export const mapFormDataToApiData = (
    formData: PleiepengesøknadFormData,
    barn: BarnReceivedFromApi[],
    locale: Locale = 'nb'
): PleiepengesøknadApiData | undefined => {
    const {
        barnetsNavn,
        barnetsFødselsnummer,
        // barnetsFødselsdato,
        barnetSøknadenGjelder,
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        arbeidsforhold,
        // periodeFra,
        // periodeTil,
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
        harHattInntektSomFrilanser,
    } = formData;

    const periodeFra = datepickerUtils.getDateFromDateString(formData.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(formData.periodeTil);
    const barnetsFødselsdato = datepickerUtils.getDateFromDateString(formData.barnetsFødselsdato);

    if (periodeFra && periodeTil) {
        try {
            const barnObject: BarnToSendToApi = mapBarnToApiData(
                barn,
                barnetsNavn,
                barnetsFødselsnummer,
                barnetsFødselsdato,
                barnetSøknadenGjelder
            );

            const sprak = getValidSpråk(locale);
            const apiData: PleiepengesøknadApiData = {
                newVersion: true,
                språk: sprak,
                barn: barnObject,
                arbeidsgivere: {
                    organisasjoner: arbeidsforhold
                        .filter((a) => a.erAnsattIPerioden === YesOrNo.YES)
                        .map((forhold) => mapArbeidsforholdToApiData(forhold)),
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
                vedlegg: legeerklæring
                    .filter((attachment) => !attachmentUploadHasFailed(attachment))
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .map(({ url }) => url!),
                harMedsøker: harMedsøker === YesOrNo.YES,
                harBekreftetOpplysninger,
                harForståttRettigheterOgPlikter,
                harVærtEllerErVernepliktig: formData.harVærtEllerErVernepliktig === YesOrNo.YES,
                andreYtelserFraNAV: formData.mottarAndreYtelser === YesOrNo.YES ? formData.andreYtelser : [],
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

            if (isFeatureEnabled(Feature.TOGGLE_8_UKER)) {
                const info8uker = erPeriodeOver8Uker(periodeFra, periodeTil);
                if (info8uker.erOver8Uker) {
                    apiData.bekrefterPeriodeOver8Uker = formData.bekrefterPeriodeOver8uker === YesOrNo.YES;
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

            apiData.harHattInntektSomFrilanser = harHattInntektSomFrilanser === YesOrNo.YES;
            apiData.frilans = mapFrilansToApiData(formData);

            if (formData.selvstendig_virksomheter) {
                const harHattInntektSomSn = formData.selvstendig_harHattInntektSomSN === YesOrNo.YES;
                apiData.harHattInntektSomSelvstendigNæringsdrivende = harHattInntektSomSn;
                if (harHattInntektSomSn) {
                    apiData.selvstendigVirksomheter = formData.selvstendig_virksomheter.map((v) =>
                        mapVirksomhetToVirksomhetApiData(locale, v)
                    );
                }
            }

            apiData.samtidigHjemme = harMedsøker === YesOrNo.YES ? samtidigHjemme === YesOrNo.YES : undefined;

            if (tilsynsordning !== undefined) {
                apiData.tilsynsordning = mapTilsynsordningToApiData(tilsynsordning);
                if (
                    tilsynsordning.skalBarnHaTilsyn === YesOrNo.YES ||
                    tilsynsordning.skalBarnHaTilsyn === YesOrNo.DO_NOT_KNOW
                ) {
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
