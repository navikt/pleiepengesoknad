import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Tilsynsordning } from '../../types/PleiepengesøknadFormData';
import { mapTilsynsordningToApiData } from '../formToApiMaps/mapTilsynsordningToApiData';

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

jest.mock('./../featureToggleUtils.ts', () => ({
    isFeatureEnabled: jest.fn(),
    Feature: {},
}));

describe('mapTilsynsordningToApiData', () => {
    it('should return correct values when NO is selected', () => {
        const tilsyn: Tilsynsordning = {
            skalBarnHaTilsyn: YesOrNo.NO,
            ja: {
                tilsyn: undefined,
            },
        };
        expect(JSON.stringify(undefined)).toEqual(JSON.stringify(mapTilsynsordningToApiData(tilsyn)));
    });
});
