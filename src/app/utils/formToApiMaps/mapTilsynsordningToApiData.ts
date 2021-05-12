import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { OmsorgstilbudApi, VetOmsorgstilbud } from '../../types/PleiepengesøknadApiData';
import { Omsorgstilbud, OmsorgstilbudVetPeriode } from '../../types/PleiepengesøknadFormData';

export const mapTilsynsordningToApiData = (tilsynsordning: Omsorgstilbud): OmsorgstilbudApi | undefined => {
    const { ja, skalBarnIOmsorgstilbud: skalBarnHaTilsyn } = tilsynsordning;

    if (skalBarnHaTilsyn === YesOrNo.YES && ja) {
        if (ja.hvorMyeTid === OmsorgstilbudVetPeriode.vetHelePerioden && ja.fasteDager) {
            const { fasteDager: tilsyn } = ja;
            const dager = tilsyn
                ? {
                      mandag: tilsyn.mandag ? timeToIso8601Duration(tilsyn.mandag) : undefined,
                      tirsdag: tilsyn.tirsdag ? timeToIso8601Duration(tilsyn.tirsdag) : undefined,
                      onsdag: tilsyn.onsdag ? timeToIso8601Duration(tilsyn.onsdag) : undefined,
                      torsdag: tilsyn.torsdag ? timeToIso8601Duration(tilsyn.torsdag) : undefined,
                      fredag: tilsyn.fredag ? timeToIso8601Duration(tilsyn.fredag) : undefined,
                  }
                : undefined;
            return {
                vetOmsorgstilbud: VetOmsorgstilbud.VET_ALLE_TIMER,
                fasteDager: dager,
            };
        }
        if (ja.hvorMyeTid === OmsorgstilbudVetPeriode.usikker) {
            if (ja.vetMinAntallTimer === YesOrNo.YES && ja.fasteDager) {
                const { fasteDager: tilsyn } = ja;
                const dager = tilsyn
                    ? {
                          mandag: tilsyn.mandag ? timeToIso8601Duration(tilsyn.mandag) : undefined,
                          tirsdag: tilsyn.tirsdag ? timeToIso8601Duration(tilsyn.tirsdag) : undefined,
                          onsdag: tilsyn.onsdag ? timeToIso8601Duration(tilsyn.onsdag) : undefined,
                          torsdag: tilsyn.torsdag ? timeToIso8601Duration(tilsyn.torsdag) : undefined,
                          fredag: tilsyn.fredag ? timeToIso8601Duration(tilsyn.fredag) : undefined,
                      }
                    : undefined;
                return {
                    vetOmsorgstilbud: VetOmsorgstilbud.VET_NOEN_TIMER,
                    fasteDager: dager,
                };
            }
            if (ja.vetMinAntallTimer === YesOrNo.NO) {
                return {
                    vetOmsorgstilbud: VetOmsorgstilbud.VET_IKKE,
                };
            }
        }
    }

    return undefined;
};
