import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { HistoriskOmsorgstilbudApiData, PlanlagtOmsorgstilbudApiData, SøknadApiData } from '../../types/SøknadApiData';
import { Omsorgstilbud } from '../../types/SøknadFormData';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../fortidFremtidUtils';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

type OmsorgstilbudApiDataPart = Pick<SøknadApiData, 'omsorgstilbud'>;

export const mapPlanlagtOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange,
    søknadsdato: Date
): PlanlagtOmsorgstilbudApiData | undefined => {
    const { planlagt, skalBarnIOmsorgstilbud } = omsorgstilbud;

    if (skalBarnIOmsorgstilbud !== YesOrNo.YES || !planlagt) {
        return undefined;
    }

    const { erLiktHverUke, fasteDager, enkeltdager } = planlagt;

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            erLiktHverUke: true,
            ukedager: getFasteDagerApiData(fasteDager),
        };
    }
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager && periodeFraOgMedSøknadsdato) {
        return {
            erLiktHverUke: false,
            enkeltdager: getEnkeltdagerIPeriodeApiData(enkeltdager, periodeFraOgMedSøknadsdato),
        };
    }
    return undefined;
};

export const mapHistoriskOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange,
    søknadsdato: Date
): HistoriskOmsorgstilbudApiData | undefined => {
    const { harBarnVærtIOmsorgstilbud, historisk } = omsorgstilbud;

    if (harBarnVærtIOmsorgstilbud !== YesOrNo.YES || !historisk) {
        return undefined;
    }
    const { erLiktHverUke, fasteDager, enkeltdager } = historisk;

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            erLiktHverUke: true,
            ukedager: getFasteDagerApiData(fasteDager),
        };
    }

    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, søknadsdato);
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager && periodeFørSøknadsdato) {
        return {
            erLiktHverUke: false,
            enkeltdager: getEnkeltdagerIPeriodeApiData(enkeltdager, periodeFørSøknadsdato),
        };
    }
    return undefined;
};

export const getOmsorgstilbudApiData = (
    omsorgstilbud: Omsorgstilbud | undefined,
    søknadsperiode: DateRange,
    søknadsdato: Date
): OmsorgstilbudApiDataPart => {
    if (omsorgstilbud?.historisk || omsorgstilbud?.planlagt) {
        return {
            omsorgstilbud: {
                historisk: mapHistoriskOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode, søknadsdato),
                planlagt: mapPlanlagtOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode, søknadsdato),
            },
        };
    }
    return { omsorgstilbud: undefined };
};
