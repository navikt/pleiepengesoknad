import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { datoErInnenforTidsrom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange, dateToISOString, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { TidIOmsorgstilbud } from '../../components/omsorgstilbud/types';
import { OmsorgstilbudApi, OmsorgstilbudDagApi } from '../../types/PleiepengesøknadApiData';
import { Omsorgstilbud, OmsorgstilbudFasteDager } from '../../types/PleiepengesøknadFormData';

export const getFasteDager = ({ mandag, tirsdag, onsdag, torsdag, fredag }: OmsorgstilbudFasteDager) => ({
    mandag: mandag ? timeToIso8601Duration(mandag) : undefined,
    tirsdag: tirsdag ? timeToIso8601Duration(tirsdag) : undefined,
    onsdag: onsdag ? timeToIso8601Duration(onsdag) : undefined,
    torsdag: torsdag ? timeToIso8601Duration(torsdag) : undefined,
    fredag: fredag ? timeToIso8601Duration(fredag) : undefined,
});

const sortEnkeltdager = (d1: OmsorgstilbudDagApi, d2: OmsorgstilbudDagApi): number =>
    dayjs(d1.dato).isBefore(d2.dato, 'day') ? -1 : 1;

export const getEnkeltdager = (enkeltdager: TidIOmsorgstilbud, søknadsperiode: DateRange): OmsorgstilbudDagApi[] => {
    const dager: OmsorgstilbudDagApi[] = [];

    Object.keys(enkeltdager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && datoErInnenforTidsrom(dato, søknadsperiode)) {
            dager.push({
                dato: dateToISOString(dato),
                tid: timeToIso8601Duration(enkeltdager[dag]),
            });
        }
    });

    return dager.sort(sortEnkeltdager);
};

export const mapTilsynsordningToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange
): OmsorgstilbudApi | undefined => {
    const { ja, skalBarnIOmsorgstilbud } = omsorgstilbud;

    if (skalBarnIOmsorgstilbud === YesOrNo.NO || !ja) {
        return undefined; // !ja: bør denne logges som feil?
    }

    const { erLiktHverDag, fasteDager, enkeltdager } = ja;

    if (erLiktHverDag === YesOrNo.YES && fasteDager) {
        return {
            vetOmsorgstilbud: true,
            fasteDager: getFasteDager(fasteDager),
        };
    }
    if (erLiktHverDag === YesOrNo.NO && enkeltdager) {
        return {
            vetOmsorgstilbud: true,
            enkeltDager: getEnkeltdager(enkeltdager, søknadsperiode),
        };
    }

    return undefined; // Skal ikke komme hit - logges?
};
