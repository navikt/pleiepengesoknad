import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { PleiepengesøknadApiData } from '../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../types/Søkerdata';
import appSentryLogger from './appSentryLogger';
import { Feature, isFeatureEnabled } from './featureToggleUtils';
import { getArbeidsgivereISøknadsperiodenApiData } from './formToApiMaps/arbeidsgivereApiData';
import { filterAndMapAttachmentsToApiFormat } from './formToApiMaps/attachmentsToApiData';
import { getBarnApiData } from './formToApiMaps/barnApiData';
import { getFerieuttakIPeriodenApiData } from './formToApiMaps/ferieuttakIPeriodenApiData';
import { getFrilansApiData } from './formToApiMaps/frilansApiData';
import { getMedlemsskapApiData } from './formToApiMaps/medlemsskapApiData';
import { getNattevåkOgBeredskapApiData } from './formToApiMaps/nattevåkOgBeredskapApiData';
import { getOmsorgstilbudApiData } from './formToApiMaps/omsorgstilbudApiData';
import { getSelvstendigNæringsdrivendeApiData } from './formToApiMaps/selvstendigNæringsdrivendeApiData';
import { getUtenlandsoppholdIPeriodenApiData } from './formToApiMaps/utenlandsoppholdIPeriodenApiData';
import { getValidSpråk } from './sprakUtils';

export const mapFormDataToApiData = (
    formData: PleiepengesøknadFormData,
    barn: BarnReceivedFromApi[],
    locale: Locale = 'nb',
    søknadsdato: Date
): PleiepengesøknadApiData | undefined => {
    const {
        harBekreftetOpplysninger,
        harForståttRettigheterOgPlikter,
        legeerklæring,
        harMedsøker,
        samtidigHjemme,
        omsorgstilbud,
        skalOppholdeSegIUtlandetIPerioden,
        utenlandsoppholdIPerioden,
    } = formData;

    const periodeFra = datepickerUtils.getDateFromDateString(formData.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(formData.periodeTil);

    if (periodeFra && periodeTil) {
        const søknadsperiode: DateRange = {
            from: periodeFra,
            to: periodeTil,
        };
        try {
            const sprak = getValidSpråk(locale);
            const apiData: PleiepengesøknadApiData = {
                språk: sprak,
                harBekreftetOpplysninger,
                harForståttRettigheterOgPlikter,
                fraOgMed: formatDateToApiFormat(periodeFra),
                tilOgMed: formatDateToApiFormat(periodeTil),
                vedlegg: filterAndMapAttachmentsToApiFormat(legeerklæring),
                harMedsøker: harMedsøker === YesOrNo.YES,
                samtidigHjemme: harMedsøker === YesOrNo.YES ? samtidigHjemme === YesOrNo.YES : undefined,
                harVærtEllerErVernepliktig: formData.harVærtEllerErVernepliktig
                    ? formData.harVærtEllerErVernepliktig === YesOrNo.YES
                    : undefined,
                utenlandsoppholdIPerioden: {
                    skalOppholdeSegIUtlandetIPerioden: skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES,
                    opphold:
                        skalOppholdeSegIUtlandetIPerioden === YesOrNo.YES && utenlandsoppholdIPerioden
                            ? utenlandsoppholdIPerioden.map((o) => getUtenlandsoppholdIPeriodenApiData(o, sprak))
                            : [],
                },
                ...getFerieuttakIPeriodenApiData(formData),
                ...getBarnApiData(formData, barn),
                ...getMedlemsskapApiData(formData, sprak),
                ...getOmsorgstilbudApiData(
                    omsorgstilbud,
                    {
                        from: periodeFra,
                        to: periodeTil,
                    },
                    søknadsdato
                ),
                ...getNattevåkOgBeredskapApiData(formData),
                ...getArbeidsgivereISøknadsperiodenApiData(formData, søknadsperiode, søknadsdato),
                ...getFrilansApiData(formData, søknadsperiode, søknadsdato),
                ...getSelvstendigNæringsdrivendeApiData(formData, søknadsperiode, søknadsdato, locale),
            };

            if (isFeatureEnabled(Feature.ANDRE_YTELSER)) {
                apiData.andreYtelserFraNAV = formData.mottarAndreYtelser === YesOrNo.YES ? formData.andreYtelser : [];
            }

            return apiData;
        } catch (e) {
            console.error(e);
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
