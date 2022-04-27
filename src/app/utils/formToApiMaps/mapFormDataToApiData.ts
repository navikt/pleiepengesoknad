import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { RegistrerteBarn } from '../../types';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormData } from '../../types/SøknadFormData';
import { Søknadsdata } from '../../types/søknadsdata/Søknadsdata';
import appSentryLogger from '../appSentryLogger';
import { getValidSpråk } from '../sprakUtils';
import { getArbeidsgivereApiDataFromSøknadsdata } from '../søknadsdataToApiData/getArbeidsgivereApiDataFromSøknadsdata';
import { getBarnApiDataFromSøknadsdata } from '../søknadsdataToApiData/getBarnApiDataFromSøknadsdata';
import { getFrilansApiDataFromSøknadsdata } from '../søknadsdataToApiData/getFrilansApiDataFromSøknadsdata';
import { getMedlemskapApiDataFromSøknadsdata } from '../søknadsdataToApiData/getMedlemskapApiDataFromSøknadsdata';
import { getSelvstendigApiDataFromSøknadsdata } from '../søknadsdataToApiData/getSelvstendigApiDataFromSøknadsdata';
import { getAttachmentsApiData } from './getAttachmentsApiData';
import { getMedsøkerApiDataFromSøknadsdata } from '../søknadsdataToApiData/getMedsøkerApiDataFromSøknadsdata';
import { getUtenlandsoppholdIPeriodenApiDataFromSøknadsdata } from '../søknadsdataToApiData/getUtenlandsoppholdIPeriodenFromSøknadsdata';
import { getFerieuttakIPeriodenApiDataFromSøknadsdata } from '../søknadsdataToApiData/getFerieuttakIPeriodenApiDataFromSøknadsdata';
import { getNattevåkApiDataFromSøknadsdata } from '../søknadsdataToApiData/getNattevåkApiDataFromSøknadsdata';
import { getBeredskapApiDataFromSøknadsdata } from '../søknadsdataToApiData/getBeredskapApiDataFromSøknadsdata';
import { getOmsorgstilbudApiDataFromSøknadsdata } from '../søknadsdataToApiData/getOmsorgstibudApiDataFromSøknadsdata';

export const mapFormDataToApiData = (
    formData: SøknadFormData,
    barn: RegistrerteBarn[],
    søknadsdata: Søknadsdata,
    locale: Locale = 'nb'
): SøknadApiData | undefined => {
    const { legeerklæring } = formData;

    const { søknadsperiode, harForståttRettigheterOgPlikter, harBekreftetOpplysninger } = søknadsdata;

    if (søknadsperiode) {
        try {
            const sprak = getValidSpråk(locale);
            const apiData: SøknadApiData = {
                språk: sprak,
                harForståttRettigheterOgPlikter: harForståttRettigheterOgPlikter
                    ? harForståttRettigheterOgPlikter
                    : false,
                harBekreftetOpplysninger: harBekreftetOpplysninger ? harBekreftetOpplysninger : false,
                fraOgMed: formatDateToApiFormat(søknadsperiode.from),
                tilOgMed: formatDateToApiFormat(søknadsperiode.to),
                vedlegg: getAttachmentsApiData(legeerklæring),
                ...getMedsøkerApiDataFromSøknadsdata(søknadsdata.medsøker),
                harVærtEllerErVernepliktig: søknadsdata.harVærtEllerErVernepliktig,
                ...getUtenlandsoppholdIPeriodenApiDataFromSøknadsdata(sprak, søknadsdata.utenlandsoppholdIPerioden),
                ferieuttakIPerioden: getFerieuttakIPeriodenApiDataFromSøknadsdata(søknadsdata.ferieuttakIPerioden),
                ...getBarnApiDataFromSøknadsdata(barn, søknadsdata.barn),
                ...getOmsorgstilbudApiDataFromSøknadsdata(søknadsperiode, søknadsdata.omsorgstibud),
                ...getNattevåkApiDataFromSøknadsdata(søknadsdata.nattevåk),
                ...getBeredskapApiDataFromSøknadsdata(søknadsdata.beredskap),
                medlemskap: getMedlemskapApiDataFromSøknadsdata(sprak, søknadsdata.medlemskap),
                arbeidsgivere: getArbeidsgivereApiDataFromSøknadsdata(
                    søknadsdata.arbeid?.arbeidsgivere,
                    søknadsperiode
                ),
                frilans: getFrilansApiDataFromSøknadsdata(søknadsdata.arbeid?.frilans, søknadsperiode),
                selvstendigNæringsdrivende: getSelvstendigApiDataFromSøknadsdata(
                    søknadsdata.arbeid?.selvstendig,
                    søknadsperiode,
                    locale
                ),
            };

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
