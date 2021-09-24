import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday, datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { TidsbrukDag, VetOmsorgstilbud } from '../../types';
import {
    HistoriskOmsorgstilbudApiData,
    TidEnkeltdagApiData,
    PlanlagtOmsorgstilbudApiData,
    PleiepengesøknadApiData,
} from '../../types/PleiepengesøknadApiData';
import { Omsorgstilbud, OmsorgstilbudFasteDager } from '../../types/PleiepengesøknadFormData';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../omsorgstilbudUtils';

export const getFasteDager = ({ mandag, tirsdag, onsdag, torsdag, fredag }: OmsorgstilbudFasteDager) => ({
    mandag: mandag ? timeToIso8601Duration(mandag) : undefined,
    tirsdag: tirsdag ? timeToIso8601Duration(tirsdag) : undefined,
    onsdag: onsdag ? timeToIso8601Duration(onsdag) : undefined,
    torsdag: torsdag ? timeToIso8601Duration(torsdag) : undefined,
    fredag: fredag ? timeToIso8601Duration(fredag) : undefined,
});

const sortEnkeltdager = (d1: TidEnkeltdagApiData, d2: TidEnkeltdagApiData): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getEnkeltdagerIPeriode = (enkeltdager: TidsbrukDag, periode: DateRange): TidEnkeltdagApiData[] => {
    const dager: TidEnkeltdagApiData[] = [];

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && datoErInnenforTidsrom(dato, periode)) {
            dager.push({
                dato: dateToISOString(dato),
                tid: timeToIso8601Duration(enkeltdager[dag]),
            });
        }
    });

    return dager.sort(sortEnkeltdager);
};

type OmsorgstilbudApiDataPart = Pick<PleiepengesøknadApiData, 'omsorgstilbudV2'>;

const mapPlanlagtOmsorgstilbudToApiData = (
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
            ukedager: getFasteDager(fasteDager),
        };
    }
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, dateToday);
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager && periodeFraOgMedSøknadsdato) {
        return {
            vetOmsorgstilbud: vetHvorMyeTid,
            erLiktHverUke: erLiktHverUke === YesOrNo.NO ? false : undefined,
            enkeltdager: getEnkeltdagerIPeriode(enkeltdager, periodeFraOgMedSøknadsdato),
        };
    }
    return undefined;
};

const mapHistoriskOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange
): HistoriskOmsorgstilbudApiData | undefined => {
    const { harBarnVærtIOmsorgstilbud, historisk } = omsorgstilbud;
    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, dateToday);
    if (harBarnVærtIOmsorgstilbud === YesOrNo.YES && historisk?.enkeltdager && periodeFørSøknadsdato) {
        return {
            enkeltdager: getEnkeltdagerIPeriode(historisk.enkeltdager, periodeFørSøknadsdato),
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
            omsorgstilbudV2: {
                historisk: mapHistoriskOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode),
                planlagt: mapPlanlagtOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode),
            },
        };
    }
    return { omsorgstilbudV2: undefined };
};
