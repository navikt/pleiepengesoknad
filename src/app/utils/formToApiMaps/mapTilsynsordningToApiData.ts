import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { getMonthsInDateRange } from '@navikt/sif-common-forms/lib/omsorgstilbud/omsorgstilbudUtils';
import { OmsorgstilbudMåned, TidIOmsorgstilbud } from '@navikt/sif-common-forms/lib/omsorgstilbud/types';
import dayjs from 'dayjs';
import { OmsorgstilbudApi, VetOmsorgstilbud, OmsorgstilbudDagApi } from '../../types/PleiepengesøknadApiData';
import { Omsorgstilbud, OmsorgstilbudFasteDager } from '../../types/PleiepengesøknadFormData';
import { skalSpørreOmOmsorgstilbudPerMåned } from '../omsorgstilbudUtils';

export const getFasteDager = ({ mandag, tirsdag, onsdag, torsdag, fredag }: OmsorgstilbudFasteDager) => ({
    mandag: mandag ? timeToIso8601Duration(mandag) : undefined,
    tirsdag: tirsdag ? timeToIso8601Duration(tirsdag) : undefined,
    onsdag: onsdag ? timeToIso8601Duration(onsdag) : undefined,
    torsdag: torsdag ? timeToIso8601Duration(torsdag) : undefined,
    fredag: fredag ? timeToIso8601Duration(fredag) : undefined,
});

export const getEnkeltdager = (
    måneder: OmsorgstilbudMåned[],
    enkeltdager: TidIOmsorgstilbud,
    søknadsperiode: DateRange
): OmsorgstilbudDagApi[] => {
    const dager: OmsorgstilbudDagApi[] = [];
    if (skalSpørreOmOmsorgstilbudPerMåned(søknadsperiode)) {
        getMonthsInDateRange(søknadsperiode).forEach((month, index) => {
            const { skalHaOmsorgstilbud } = måneder[index] || {};
            if (!skalHaOmsorgstilbud || skalHaOmsorgstilbud === YesOrNo.YES) {
                Object.keys(enkeltdager).forEach((dag) => {
                    const dato = ISOStringToDate(dag);
                    if (dato !== undefined && dayjs(dato).isSame(month.from, 'month')) {
                        dager.push({
                            dato: dateToISOString(dato),
                            tid: timeToIso8601Duration(enkeltdager[dag]),
                        });
                    }
                });
            }
        });
    } else {
        Object.keys(enkeltdager).forEach((dag) => {
            const dato = ISOStringToDate(dag);
            if (dato && datoErInnenforTidsrom(dato, søknadsperiode)) {
                dager.push({
                    dato: dateToISOString(dato),
                    tid: timeToIso8601Duration(enkeltdager[dag]),
                });
            }
        });
    }
    return dager;
};

export const mapTilsynsordningToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange
): OmsorgstilbudApi | undefined => {
    const { ja, skalBarnIOmsorgstilbud } = omsorgstilbud;

    if (skalBarnIOmsorgstilbud === YesOrNo.NO || !ja) {
        return undefined; // !ja: bør denne logges som feil?
    }

    const { vetHvorMyeTid, vetNoeTid, erLiktHverDag, fasteDager, måneder, enkeltdager } = ja;

    if (vetHvorMyeTid === YesOrNo.NO && vetNoeTid === YesOrNo.NO) {
        return {
            vetOmsorgstilbud: VetOmsorgstilbud.VET_IKKE,
        };
    }

    const vetOmsorgstilbud =
        vetHvorMyeTid === YesOrNo.YES ? VetOmsorgstilbud.VET_ALLE_TIMER : VetOmsorgstilbud.VET_NOEN_TIMER;

    if (erLiktHverDag === YesOrNo.YES && fasteDager) {
        return {
            vetOmsorgstilbud,
            fasteDager: getFasteDager(fasteDager),
        };
    }
    if (erLiktHverDag === YesOrNo.NO && måneder && enkeltdager) {
        return {
            vetOmsorgstilbud,
            enkeltDager: getEnkeltdager(måneder, enkeltdager, søknadsperiode),
        };
    }

    return undefined; // Skal ikke komme hit - logges?
};
