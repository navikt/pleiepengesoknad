import { StepID } from '../../config/stepConfig';
import routeConfig from '../../config/routeConfig';
import { getSøknadRoute } from '../routeHelper';

describe('routeHelper', () => {
    describe('getSøknadRoute', () => {
        it('should prefix provided string with a common prefix for routes', () => {
            const s1 = StepID.ANSETTELSESFORHOLD;
            const s2 = StepID.SUMMARY;
            expect(getSøknadRoute(s1)).toEqual(`${routeConfig.SØKNAD_ROUTE_PREFIX}/${s1}`);
            expect(getSøknadRoute(s2)).toEqual(`${routeConfig.SØKNAD_ROUTE_PREFIX}/${s2}`);
        });
    });
});
