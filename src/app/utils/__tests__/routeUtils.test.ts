import { StepID } from '../../config/stepConfig';
import routeConfig from '../../config/routeConfig';
import { getSøknadRoute, stepRouteIsAvailable } from '../routeUtils';
import * as stepUtils from '../stepUtils';

jest.mock('./../stepUtils', () => {
    return {
        opplysningerOmBarnetStepAvailable: jest.fn(() => 'barn step available'),
        opplysningerOmTidsromStepAvailable: jest.fn(() => 'tidsrom step available'),
        opplysningerOmAnsettelsesforholdStepAvailable: jest.fn(() => 'ansettelsesforhold step available'),
        legeerklæringStepAvailable: jest.fn(() => 'legeerklæring step available'),
        medlemsskapStepAvailable: jest.fn(() => 'medlemsskap step available'),
        summaryStepAvailable: jest.fn(() => 'summary step available')
    };
});

const formValues = {} as any;

describe('routeUtils', () => {
    describe('getSøknadRoute', () => {
        it('should prefix provided string with a common prefix for routes', () => {
            const s1 = StepID.ANSETTELSESFORHOLD;
            const s2 = StepID.SUMMARY;
            expect(getSøknadRoute(s1)).toEqual(`${routeConfig.SØKNAD_ROUTE_PREFIX}/${s1}`);
            expect(getSøknadRoute(s2)).toEqual(`${routeConfig.SØKNAD_ROUTE_PREFIX}/${s2}`);
        });
    });

    describe('stepRouteIsAvailable', () => {
        it('should return result from calling opplysningerOmBarnetStepAvailable if stepId=StepID.OPPLYSNINGER_OM_BARNET', () => {
            stepRouteIsAvailable(StepID.OPPLYSNINGER_OM_BARNET, formValues);
            expect(stepUtils.opplysningerOmBarnetStepAvailable).toHaveBeenCalledWith(formValues);
        });

        describe('when running app in development', () => {
            it('should return true if app is running in development', () => {
                process.env.NODE_ENV = 'development';
                expect(stepRouteIsAvailable(StepID.OPPLYSNINGER_OM_BARNET, formValues)).toBe(true);
            });
        });
    });
});
