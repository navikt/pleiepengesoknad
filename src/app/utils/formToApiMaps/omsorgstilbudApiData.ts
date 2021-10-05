import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { VetOmsorgstilbud } from '../../types';
import {
    HistoriskOmsorgstilbudApiData,
    PlanlagtOmsorgstilbudApiData,
    PleiepengesøknadApiData,
} from '../../types/PleiepengesøknadApiData';
import { Omsorgstilbud } from '../../types/PleiepengesøknadFormData';
import {
    getEnkeltdagerIPeriodeApiData,
    getFasteDagerApiData,
    getHistoriskPeriode,
    getPlanlagtPeriode,
} from '../tidsbrukUtils';

type OmsorgstilbudApiDataPart = Pick<PleiepengesøknadApiData, 'omsorgstilbud'>;

export const mapPlanlagtOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange
): PlanlagtOmsorgstilbudApiData | undefined => {
    const { planlagt, skalBarnIOmsorgstilbud } = omsorgstilbud;

    if (skalBarnIOmsorgstilbud === YesOrNo.NO || !planlagt) {
        return undefined;
    }

    const { erLiktHverUke, fasteDager, enkeltdager, vetHvorMyeTid } = planlagt;
    if (vetHvorMyeTid === VetOmsorgstilbud.VET_IKKE) {
        return {
            vetOmsorgstilbud: VetOmsorgstilbud.VET_IKKE,
        };
    }

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            vetOmsorgstilbud: vetHvorMyeTid,
            erLiktHverUke: true,
            ukedager: getFasteDagerApiData(fasteDager),
        };
    }
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, dateToday);
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager && periodeFraOgMedSøknadsdato) {
        return {
            vetOmsorgstilbud: vetHvorMyeTid,
            erLiktHverUke: erLiktHverUke === YesOrNo.NO ? false : undefined,
            enkeltdager: getEnkeltdagerIPeriodeApiData(enkeltdager, periodeFraOgMedSøknadsdato),
        };
    }
    return undefined;
};

export const mapHistoriskOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange
): HistoriskOmsorgstilbudApiData | undefined => {
    const { harBarnVærtIOmsorgstilbud, historisk } = omsorgstilbud;
    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, dateToday);
    if (harBarnVærtIOmsorgstilbud === YesOrNo.YES && historisk?.enkeltdager && periodeFørSøknadsdato) {
        return {
            enkeltdager: getEnkeltdagerIPeriodeApiData(historisk.enkeltdager, periodeFørSøknadsdato),
        };
    }
    return undefined;
};

export const getOmsorgstilbudApiData = (
    omsorgstilbud: Omsorgstilbud | undefined,
    søknadsperiode: DateRange
): OmsorgstilbudApiDataPart => {
    if (omsorgstilbud?.historisk || omsorgstilbud?.planlagt) {
        return {
            omsorgstilbud: {
                historisk: mapHistoriskOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode),
                planlagt: mapPlanlagtOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode),
            },
        };
    }
    return { omsorgstilbud: undefined };
};
