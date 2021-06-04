import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudMåned } from '@navikt/sif-common-forms/lib/omsorgstilbud/types';
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

export const getEnkeltdager = (måneder: OmsorgstilbudMåned[], søknadsperiode: DateRange): OmsorgstilbudDagApi[] => {
    const dager: OmsorgstilbudDagApi[] = [];
    if (skalSpørreOmOmsorgstilbudPerMåned(søknadsperiode)) {
    } else {
    }
    // getMonthsInDateRange(søknadsperiode).forEach((måned, index) => {
    //     skalSpørreOmOmsorgstilbudPerMåned
    // });
    // const månederISøknadsperiode = getMån;
    // const datoer = getDatoerForOmsorgstilbudPeriode(søknadsperiode.from, søknadsperiode.to);

    // måneder
    //     .filter((måned) => måned.skalHaOmsorgstilbud === YesOrNo.YES)
    //     .forEach((måned) => {
    //         const datoerIMåned = getDatoerForOmsorgstilbudPeriode(måned);
    //         // periode.omsorgsdager.forEach((dag) => {
    //         //     dager.push({ dato: dateToISOString(dag.dato), tid: timeToIso8601Duration(dag.tid) });
    //         // });
    //     });
    return dager;
};

export const mapTilsynsordningToApiData = (
    tilsynsordning: Omsorgstilbud,
    søknadsperiode: DateRange
): OmsorgstilbudApi | undefined => {
    const { ja, skalBarnIOmsorgstilbud: skalBarnHaTilsyn } = tilsynsordning;

    if (skalBarnHaTilsyn === YesOrNo.NO || !ja) {
        return undefined; // !ja: bør denne logges som feil?
    }

    const { vetHvorMyeTid, vetNoeTid, erLiktHverDag, fasteDager, måneder } = ja;

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
    if (erLiktHverDag === YesOrNo.NO && måneder) {
        return {
            vetOmsorgstilbud,
            enkeltDager: getEnkeltdager(måneder, søknadsperiode),
        };
    }

    return undefined; // Skal ikke komme hit - logges?
};
