import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { TidIOmsorgstilbud } from '../../components/omsorgstilbud/types';
import {
    HistoriskOmsorgstilbudApi,
    OmsorgstilbudDagApi,
    PlanlagtOmsorgstilbudApi,
    VetOmsorgstilbud,
} from '../../types/PleiepengesøknadApiData';
import { Omsorgstilbud, OmsorgstilbudFasteDager } from '../../types/PleiepengesøknadFormData';
import { getPeriodeFraOgMedSøknadsdato, getPeriodeFørSøknadsdato } from '../omsorgstilbudUtils';

export const getFasteDager = ({ mandag, tirsdag, onsdag, torsdag, fredag }: OmsorgstilbudFasteDager) => ({
    mandag: mandag ? timeToIso8601Duration(mandag) : undefined,
    tirsdag: tirsdag ? timeToIso8601Duration(tirsdag) : undefined,
    onsdag: onsdag ? timeToIso8601Duration(onsdag) : undefined,
    torsdag: torsdag ? timeToIso8601Duration(torsdag) : undefined,
    fredag: fredag ? timeToIso8601Duration(fredag) : undefined,
});

const sortEnkeltdager = (d1: OmsorgstilbudDagApi, d2: OmsorgstilbudDagApi): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getEnkeltdagerIPeriode = (enkeltdager: TidIOmsorgstilbud, periode: DateRange): OmsorgstilbudDagApi[] => {
    const dager: OmsorgstilbudDagApi[] = [];

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

export const mapPlanlagtOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange
): PlanlagtOmsorgstilbudApi | undefined => {
    const { planlagt, skalBarnIOmsorgstilbud } = omsorgstilbud;

    if (skalBarnIOmsorgstilbud === YesOrNo.NO || !planlagt) {
        return undefined;
    }

    const { erLiktHverDag, fasteDager, enkeltdager, vetHvorMyeTid } = planlagt;
    if (vetHvorMyeTid === VetOmsorgstilbud.VET_IKKE) {
        return {
            vetOmsorgstilbud: VetOmsorgstilbud.VET_IKKE,
        };
    }

    if (erLiktHverDag === YesOrNo.YES && fasteDager) {
        return {
            vetOmsorgstilbud: vetHvorMyeTid,
            fasteDager: getFasteDager(fasteDager),
        };
    }
    const periodeFraOgMedSøknadsdato = getPeriodeFraOgMedSøknadsdato(søknadsperiode);
    if (erLiktHverDag !== YesOrNo.YES && enkeltdager && periodeFraOgMedSøknadsdato) {
        return {
            vetOmsorgstilbud: vetHvorMyeTid,
            enkeltDager: getEnkeltdagerIPeriode(enkeltdager, periodeFraOgMedSøknadsdato),
        };
    }
    return undefined;
};

export const mapHistoriskOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange
): HistoriskOmsorgstilbudApi | undefined => {
    const { harBarnVærtIOmsorgstilbud, historisk } = omsorgstilbud;
    const periodeFørSøknadsdato = getPeriodeFørSøknadsdato(søknadsperiode);
    if (harBarnVærtIOmsorgstilbud === YesOrNo.YES && historisk?.enkeltdager && periodeFørSøknadsdato) {
        return {
            enkeltDager: getEnkeltdagerIPeriode(historisk.enkeltdager, periodeFørSøknadsdato),
        };
    }
    return undefined;
};
