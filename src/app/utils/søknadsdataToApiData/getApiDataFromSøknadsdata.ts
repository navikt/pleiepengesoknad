import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { RegistrerteBarn, ÅrsakManglerIdentitetsnummer } from '../../types';
import { SøknadApiData, SøknadApiDataVersjon } from '../../types/søknad-api-data/SøknadApiData';
import { Søknadsdata } from '../../types/søknadsdata/Søknadsdata';
import appSentryLogger from '../appSentryLogger';
import { getValidSpråk } from '../sprakUtils';
import { getArbeidsgivereApiDataFromSøknadsdata } from './getArbeidsgivereApiDataFromSøknadsdata';
import { getAttachmentsApiDataFromSøknadsdata } from './getAttachmentsApiDataFromSøknadsdata';
import { getBarnApiDataFromSøknadsdata } from './getBarnApiDataFromSøknadsdata';
import { getBeredskapApiDataFromSøknadsdata } from './getBeredskapApiDataFromSøknadsdata';
import { getFerieuttakIPeriodenApiDataFromSøknadsdata } from './getFerieuttakIPeriodenApiDataFromSøknadsdata';
import { getFrilansApiDataFromSøknadsdata } from './getFrilansApiDataFromSøknadsdata';
import { getMedlemskapApiDataFromSøknadsdata } from './getMedlemskapApiDataFromSøknadsdata';
import { getNattevåkApiDataFromSøknadsdata } from './getNattevåkApiDataFromSøknadsdata';
import { getOmsorgstilbudApiDataFromSøknadsdata } from './getOmsorgstibudApiDataFromSøknadsdata';
import { getOpptjeningIUtlandetSøknadsdata } from './getOpptjeningIUtlandetSøknadsdata';
import { getSelvstendigApiDataFromSøknadsdata } from './getSelvstendigApiDataFromSøknadsdata';
import { getStønadGodtgjørelseApiDataFromSøknadsdata } from './getStønadGodtgjørelseApiDataFromSøknadsdata';
import { getUtenlandskNæringSøknadsdata } from './getUtenlandskNæringSøknadsdata';
import { getUtenlandsoppholdIPeriodenApiDataFromSøknadsdata } from './getUtenlandsoppholdIPeriodenFromSøknadsdata';

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
                språk: sprak,
                apiDataVersjon: SøknadApiDataVersjon,
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
                ...getUtenlandsoppholdIPeriodenApiDataFromSøknadsdata(sprak, søknadsdata.utenlandsoppholdIPerioden),
                ferieuttakIPerioden: getFerieuttakIPeriodenApiDataFromSøknadsdata(søknadsdata.ferieuttakIPerioden),
                arbeidsgivere: getArbeidsgivereApiDataFromSøknadsdata(søknadsdata.arbeid?.arbeidsgivere),
                frilans: getFrilansApiDataFromSøknadsdata(søknadsdata.arbeid?.frilans),
                ...getStønadGodtgjørelseApiDataFromSøknadsdata(søknadsperiode, søknadsdata.stønadGodtgjørelse),
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
