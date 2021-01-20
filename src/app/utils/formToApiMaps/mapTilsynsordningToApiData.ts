import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { timeToIso8601Duration } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { TilsynsordningApi } from '../../types/PleiepengesøknadApiData';
import { Tilsynsordning, TilsynVetIkkeHvorfor } from '../../types/PleiepengesøknadFormData';

export const mapTilsynsordningToApiData = (tilsynsordning: Tilsynsordning): TilsynsordningApi | undefined => {
    const { ja, vetIkke, skalBarnHaTilsyn } = tilsynsordning;
    if (YesOrNo.YES === skalBarnHaTilsyn && ja) {
        const { ekstrainfo, tilsyn } = ja;
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
                ...dager,
                tilleggsinformasjon: ekstrainfo,
            },
        };
    }
    if (YesOrNo.DO_NOT_KNOW === skalBarnHaTilsyn && vetIkke) {
        return {
            svar: 'vetIkke',
            vetIkke: {
                svar: vetIkke.hvorfor,
                ...(vetIkke.hvorfor === TilsynVetIkkeHvorfor.annet
                    ? {
                          annet: vetIkke.ekstrainfo,
                      }
                    : undefined),
            },
        };
    }
    if (YesOrNo.NO === skalBarnHaTilsyn) {
        return {
            svar: 'nei',
        };
    }
    return undefined;
};
