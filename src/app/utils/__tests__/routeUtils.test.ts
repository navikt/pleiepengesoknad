import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../søknad/søknadStepsConfig';
import { getSøknadRoute } from '../routeUtils';

jest.mock('../featureToggleUtils', () => {
    return {
        isFeatureEnabled: () => false,
        Feature: {},
    };
});

jest.mock('./../stepUtils', () => {
    return {
        opplysningerOmBarnetStepAvailable: jest.fn(() => 'barn step available'),
        opplysningerOmTidsromStepAvailable: jest.fn(() => 'tidsrom step available'),
        arbeidssituasjonStepAvailable: jest.fn(() => 'arbeidsforhold step available'),
        legeerklæringStepAvailable: jest.fn(() => 'legeerklæring step available'),
        medlemskapStepAvailable: jest.fn(() => 'medlemskap step available'),
        oppsummeringStepAvailable: jest.fn(() => 'oppsummering step available'),
        skalBrukerSvarePåBeredskapOgNattevåk: jest.fn(() => false),
        skalBrukerSvarePåarbeidIPeriode: jest.fn(() => true),
    };
});

describe('routeUtils', () => {
    describe('getSøknadRoute', () => {
        it('should prefix provided string with a common prefix for routes', () => {
            const s1 = StepID.ARBEIDSSITUASJON;
            const s2 = StepID.SUMMARY;
            expect(getSøknadRoute(s1)).toEqual(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${s1}`);
            expect(getSøknadRoute(s2)).toEqual(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${s2}`);
        });
    });
});
