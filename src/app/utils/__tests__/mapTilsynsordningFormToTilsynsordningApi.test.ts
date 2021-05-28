import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Omsorgstilbud } from '../../types/PleiepengesøknadFormData';
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
        const tilsyn: Omsorgstilbud = {
            skalBarnIOmsorgstilbud: YesOrNo.NO,
            ja: {
                fasteDager: undefined,
            },
        };
        expect(JSON.stringify(undefined)).toEqual(JSON.stringify(mapTilsynsordningToApiData(tilsyn)));
    });
});
