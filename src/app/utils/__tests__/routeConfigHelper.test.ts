import { getSøknadRoute } from '../routeConfigHelper';
import { StepID } from '../../config/stepConfig';
import routeConfig from '../../config/routeConfig';

describe('routeConfigHelper', () => {
    describe('getSøknadRoute', () => {
        it('should prefix provided string with a common prefix for routes', () => {
            const s1 = StepID.ARBEIDSFORHOLD;
            const s2 = StepID.SUMMARY;
            expect(getSøknadRoute(s1)).toEqual(`${routeConfig.SØKNAD_ROUTE_PREFIX}/${s1}`);
            expect(getSøknadRoute(s2)).toEqual(`${routeConfig.SØKNAD_ROUTE_PREFIX}/${s2}`);
        });
    });
});
