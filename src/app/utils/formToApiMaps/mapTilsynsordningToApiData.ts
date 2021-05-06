import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { TilsynsordningApi, TilsynVetPeriodeApi } from '../../types/PleiepengesøknadApiData';
import { Tilsynsordning, TilsynVetPeriode } from '../../types/PleiepengesøknadFormData';

export const mapTilsynsordningToApiData = (tilsynsordning: Tilsynsordning): TilsynsordningApi | undefined => {
    const { ja, skalBarnHaTilsyn } = tilsynsordning;

    if (skalBarnHaTilsyn === YesOrNo.YES && ja) {
        if (ja.hvorMyeTid === TilsynVetPeriode.vetHelePerioden && ja.tilsyn) {
            const { tilsyn } = ja;
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
                svar: 'ja',
                ja: {
                    hvorMyeTid: TilsynVetPeriodeApi.VET_HELE_PERIODEN,
                    tilsyn: dager,
                },
            };
        }
        if (ja.hvorMyeTid === TilsynVetPeriode.usikker) {
            if (ja.vetMinAntallTimer === YesOrNo.YES && ja.tilsyn) {
                const { tilsyn } = ja;
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
                    svar: 'ja',
                    ja: {
                        hvorMyeTid: TilsynVetPeriodeApi.USIKKER,
                        tilsyn: dager,
                        vetMinAntalTimer: true,
                    },
                };
            }
            if (ja.vetMinAntallTimer === YesOrNo.NO) {
                return {
                    svar: 'ja',
                    ja: {
                        hvorMyeTid: TilsynVetPeriodeApi.USIKKER,
                        vetMinAntalTimer: false,
                    },
                };
            }
        }
        if (ja.hvorMyeTid === TilsynVetPeriode.nei) {
            return {
                svar: 'ja',
                ja: {
                    hvorMyeTid: TilsynVetPeriodeApi.NEI,
                },
            };
        }
    }

    if (skalBarnHaTilsyn === YesOrNo.NO) {
        return {
            svar: 'nei',
        };
    }
    return undefined;
};
