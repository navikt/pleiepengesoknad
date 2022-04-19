import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { RegistrerteBarn } from '../../types';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { Søknadsdata } from '../../types/søknadsdata/Søknadsdata';
import appSentryLogger from '../appSentryLogger';
import { Feature, isFeatureEnabled } from '../featureToggleUtils';
import { getValidSpråk } from '../sprakUtils';
import { getArbeidsgivereApiDataFromSøknadsdata } from '../søknadsdataToApiData/getArbeidsgivereApiDataFromSøknadsdata';
import { getBarnApiDataFromSøknadsdata } from '../søknadsdataToApiData/getBarnApiDataFromSøknadsdata';
import { getFrilansApiDataFromSøknadsdata } from '../søknadsdataToApiData/getFrilansApiDataFromSøknadsdata';
import { getMedlemskapApiDataFromSøknadsdata } from '../søknadsdataToApiData/getMedlemskapApiDataFromSøknadsdata';
import { getSelvstendigApiDataFromSøknadsdata } from '../søknadsdataToApiData/getSelvstendigApiDataFromSøknadsdata';
import { getAttachmentsApiData } from './getAttachmentsApiData';
import { getFerieuttakIPeriodenApiData } from './getFerieuttakIPeriodenApiData';
import { getNattevåkOgBeredskapApiData } from './getNattevåkOgBeredskapApiData';
import { getOmsorgstilbudApiData } from './getOmsorgstilbudApiData';
import { getUtenlandsoppholdIPeriodenApiData } from './getUtenlandsoppholdIPeriodenApiData';

export const mapFormDataToApiData = (
    formData: SøknadFormData,
    barn: RegistrerteBarn[],
    søknadsdata: Søknadsdata,
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

    const { søknadsperiode } = søknadsdata;

    if (søknadsperiode) {
        try {
            const sprak = getValidSpråk(locale);
            const apiData: SøknadApiData = {
                språk: sprak,
                harBekreftetOpplysninger,
                harForståttRettigheterOgPlikter,
                fraOgMed: formatDateToApiFormat(søknadsperiode.from),
                tilOgMed: formatDateToApiFormat(søknadsperiode.to),
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
                ...getBarnApiDataFromSøknadsdata(barn, søknadsdata.barn),
                ...getOmsorgstilbudApiData(omsorgstilbud, søknadsperiode),
                ...getNattevåkOgBeredskapApiData(formData),
                medlemskap: getMedlemskapApiDataFromSøknadsdata(sprak, søknadsdata.medlemskap),
                arbeidsgivere: getArbeidsgivereApiDataFromSøknadsdata(søknadsdata.arbeid?.arbeidsgivere),
                frilans: getFrilansApiDataFromSøknadsdata(søknadsdata.arbeid?.frilans),
                selvstendigNæringsdrivende: getSelvstendigApiDataFromSøknadsdata(
                    søknadsdata.arbeid?.selvstendig,
                    locale
                ),
            };
            if (isFeatureEnabled(Feature.ANDRE_YTELSER)) {
                apiData.andreYtelserFraNAV = formData.mottarAndreYtelser === YesOrNo.YES ? formData.andreYtelser : [];
            }

            console.log(apiData);
            return apiData;
        } catch (e) {
            console.error(e);
            appSentryLogger.logError('mapFormDataToApiData failed', e as any);
            return undefined;
        }
    } else {
        appSentryLogger.logError('mapFormDataToApiData failed - empty periode', JSON.stringify(søknadsperiode));
        return undefined;
    }
};
