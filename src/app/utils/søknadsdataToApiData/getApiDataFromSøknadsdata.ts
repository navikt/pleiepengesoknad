import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { RegistrerteBarn, ÅrsakManglerIdentitetsnummer } from '../../types';
import { MELLOMLAGRING_VERSION } from '../../types/SøknadTempStorageData';
import { SøknadApiData } from '../../types/søknad-api-data/SøknadApiData';
import { Søknadsdata } from '../../types/søknadsdata/Søknadsdata';
import appSentryLogger from '../appSentryLogger';
import { getValidSpråk } from '../sprakUtils';
import { getArbeidsgivereApiDataFromSøknadsdata } from './getArbeidsgivereApiDataFromSøknadsdata';
import { getBarnApiDataFromSøknadsdata } from './getBarnApiDataFromSøknadsdata';
import { getFrilansApiDataFromSøknadsdata } from './getFrilansApiDataFromSøknadsdata';
import { getMedlemskapApiDataFromSøknadsdata } from './getMedlemskapApiDataFromSøknadsdata';
import { getSelvstendigApiDataFromSøknadsdata } from './getSelvstendigApiDataFromSøknadsdata';
import { getMedsøkerApiDataFromSøknadsdata } from './getMedsøkerApiDataFromSøknadsdata';
import { getUtenlandsoppholdIPeriodenApiDataFromSøknadsdata } from './getUtenlandsoppholdIPeriodenFromSøknadsdata';
import { getFerieuttakIPeriodenApiDataFromSøknadsdata } from './getFerieuttakIPeriodenApiDataFromSøknadsdata';
import { getNattevåkApiDataFromSøknadsdata } from './getNattevåkApiDataFromSøknadsdata';
import { getBeredskapApiDataFromSøknadsdata } from './getBeredskapApiDataFromSøknadsdata';
import { getOmsorgstilbudApiDataFromSøknadsdata } from './getOmsorgstibudApiDataFromSøknadsdata';
import { getAttachmentsApiDataFromSøknadsdata } from './getAttachmentsApiDataFromSøknadsdata';
import { getOpptjeningIUtlandetSøknadsdata } from './getOpptjeningIUtlandetSøknadsdata';
import { getUtenlandskNæringSøknadsdata } from './getUtenlandskNæringSøknadsdata';

export const getApiDataFromSøknadsdata = (
    barn: RegistrerteBarn[],
    søknadsdata: Søknadsdata,
    harBekreftetOpplysninger: boolean,
    locale: Locale = 'nb'
): SøknadApiData | undefined => {
    const { søknadsperiode, harForståttRettigheterOgPlikter } = søknadsdata;

    if (søknadsperiode) {
        try {
            const sprak = getValidSpråk(locale);
            const apiData: SøknadApiData = {
                versjon: MELLOMLAGRING_VERSION,
                språk: sprak,
                harForståttRettigheterOgPlikter:
                    harForståttRettigheterOgPlikter !== undefined ? harForståttRettigheterOgPlikter : false,
                harBekreftetOpplysninger: harBekreftetOpplysninger !== undefined ? harBekreftetOpplysninger : false,
                ...getBarnApiDataFromSøknadsdata(barn, søknadsdata.barn),
                fødselsattestVedleggUrls:
                    søknadsdata.barn &&
                    søknadsdata.barn.type === 'annetBarnUtenFnr' &&
                    søknadsdata.barn.årsakManglerIdentitetsnummer ===
                        ÅrsakManglerIdentitetsnummer.BARNET_BOR_I_UTLANDET &&
                    søknadsdata.barn.fødselsattest
                        ? getAttachmentsApiDataFromSøknadsdata(søknadsdata.barn.fødselsattest)
                        : [],
                fraOgMed: formatDateToApiFormat(søknadsperiode.from),
                tilOgMed: formatDateToApiFormat(søknadsperiode.to),
                ...getMedsøkerApiDataFromSøknadsdata(søknadsdata.medsøker),
                ...getUtenlandsoppholdIPeriodenApiDataFromSøknadsdata(sprak, søknadsdata.utenlandsoppholdIPerioden),
                ferieuttakIPerioden: getFerieuttakIPeriodenApiDataFromSøknadsdata(søknadsdata.ferieuttakIPerioden),
                arbeidsgivere: getArbeidsgivereApiDataFromSøknadsdata(søknadsdata.arbeid?.arbeidsgivere),
                frilans: getFrilansApiDataFromSøknadsdata(søknadsdata.arbeid?.frilans),
                selvstendigNæringsdrivende: getSelvstendigApiDataFromSøknadsdata(
                    søknadsdata.arbeid?.selvstendig,
                    søknadsperiode,
                    locale
                ),
                opptjeningIUtlandet: getOpptjeningIUtlandetSøknadsdata(sprak, søknadsdata.arbeid?.opptjeningUtland),
                utenlandskNæring: getUtenlandskNæringSøknadsdata(sprak, søknadsdata.arbeid?.utenlandskNæring),
                harVærtEllerErVernepliktig: søknadsdata.harVærtEllerErVernepliktig,
                ...getOmsorgstilbudApiDataFromSøknadsdata(søknadsperiode, søknadsdata.omsorgstibud),
                ...getNattevåkApiDataFromSøknadsdata(søknadsdata.nattevåk),
                ...getBeredskapApiDataFromSøknadsdata(søknadsdata.beredskap),
                medlemskap: getMedlemskapApiDataFromSøknadsdata(sprak, søknadsdata.medlemskap),
                vedlegg:
                    søknadsdata.legeerklæring !== undefined
                        ? getAttachmentsApiDataFromSøknadsdata(søknadsdata.legeerklæring)
                        : [],
            };

            return apiData;
        } catch (e) {
            console.error(e);
            appSentryLogger.logError('getApiDataFromSøknadsdata failed', e as any);
            return undefined;
        }
    } else {
        appSentryLogger.logError('getApiDataFromSøknadsdata failed - empty periode', JSON.stringify(søknadsperiode));
        return undefined;
    }
};
