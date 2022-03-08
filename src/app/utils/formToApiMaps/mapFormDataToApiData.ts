import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { RegistrerteBarn, Søkerdata } from '../../types';
import { SøknadApiData } from '../../types/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import appSentryLogger from '../appSentryLogger';
import { Feature, isFeatureEnabled } from '../featureToggleUtils';
import { getArbeidsgivereISøknadsperiodenApiData } from './getArbeidsgivereISøknadsperiodenApiData';
import { getAttachmentsApiData } from './getAttachmentsApiData';
import { getBarnApiData } from './getBarnApiData';
import { getFerieuttakIPeriodenApiData } from './getFerieuttakIPeriodenApiData';
import { getFrilansApiData } from './getFrilansApiData';
import { getMedlemsskapApiData } from './getMedlemsskapApiData';
import { getNattevåkOgBeredskapApiData } from './getNattevåkOgBeredskapApiData';
import { getOmsorgstilbudApiData } from './getOmsorgstilbudApiData';
import { getSelvstendigNæringsdrivendeApiData } from './getSelvstendigNæringsdrivendeApiData';
import { getUtenlandsoppholdIPeriodenApiData } from './getUtenlandsoppholdIPeriodenApiData';
import { getValidSpråk } from '../sprakUtils';

export const mapFormDataToApiData = (
    formData: SøknadFormData,
    søkerdata: Søkerdata,
    barn: RegistrerteBarn[],
    locale: Locale = 'nb'
): SøknadApiData | undefined => {
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
            const apiData: SøknadApiData = {
                språk: sprak,
                harBekreftetOpplysninger,
                harForståttRettigheterOgPlikter,
                fraOgMed: formatDateToApiFormat(periodeFra),
                tilOgMed: formatDateToApiFormat(periodeTil),
                vedlegg: getAttachmentsApiData(legeerklæring),
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
                ...getOmsorgstilbudApiData(omsorgstilbud, {
                    from: periodeFra,
                    to: periodeTil,
                }),
                ...getNattevåkOgBeredskapApiData(formData),
                ...getArbeidsgivereISøknadsperiodenApiData(formData, søknadsperiode),
                ...getFrilansApiData(formData.frilans, søknadsperiode, formData.frilansoppdrag),
                ...getSelvstendigNæringsdrivendeApiData(formData, søknadsperiode, locale),
            };

            if (isFeatureEnabled(Feature.ANDRE_YTELSER)) {
                apiData.andreYtelserFraNAV = formData.mottarAndreYtelser === YesOrNo.YES ? formData.andreYtelser : [];
            }

            return apiData;
        } catch (e) {
            console.error(e);
            appSentryLogger.logError('mapFormDataToApiData failed', e as any);
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
