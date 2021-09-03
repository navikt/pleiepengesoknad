import RouteConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { getSøknadRoute, isAvailable } from '../routeUtils';
import * as stepUtils from '../stepUtils';

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
        arbeidsforholdStepAvailable: jest.fn(() => 'arbeidsforhold step available'),
        legeerklæringStepAvailable: jest.fn(() => 'legeerklæring step available'),
        medlemskapStepAvailable: jest.fn(() => 'medlemskap step available'),
        summaryStepAvailable: jest.fn(() => 'summary step available'),
        skalBrukerSvarePåBeredskapOgNattevåk: jest.fn(() => false),
        skalBrukerSvarePåArbeidsforholdIPerioden: jest.fn(() => true),
    };
});

const formValues = {} as any;

describe('routeUtils', () => {
    describe('getSøknadRoute', () => {
        it('should prefix provided string with a common prefix for routes', () => {
            const s1 = StepID.ARBEIDSFORHOLD;
            const s2 = StepID.SUMMARY;
            expect(getSøknadRoute(s1)).toEqual(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${s1}`);
            expect(getSøknadRoute(s2)).toEqual(`${RouteConfig.SØKNAD_ROUTE_PREFIX}/${s2}`);
        });
    });

    describe('isAvailable', () => {
        it('should return result from calling opplysningerOmBarnetStepAvailable if route=StepID.OPPLYSNINGER_OM_BARNET', () => {
            const result = isAvailable(StepID.OPPLYSNINGER_OM_BARNET, formValues);
            expect(stepUtils.opplysningerOmBarnetStepAvailable).toHaveBeenCalledWith(formValues);
            expect(result).toEqual(stepUtils.opplysningerOmBarnetStepAvailable(formValues));
        });

        it('should return result from calling opplysningerOmTidsromStepAvailable if route=StepID.TIDSROM', () => {
            const result = isAvailable(StepID.TIDSROM, formValues);
            expect(stepUtils.opplysningerOmBarnetStepAvailable).toHaveBeenCalledWith(formValues);
            expect(result).toEqual(stepUtils.opplysningerOmTidsromStepAvailable(formValues));
        });

        it('should return result from calling arbeidsforholdStepAvailable if route=StepID.ARBEIDSFORHOLD', () => {
            const result = isAvailable(StepID.ARBEIDSFORHOLD, formValues);
            expect(stepUtils.arbeidsforholdStepAvailable).toHaveBeenCalledWith(formValues);
            expect(result).toEqual(stepUtils.arbeidsforholdStepAvailable(formValues));
        });

        it('should return result from calling legeerklæringStepAvailable if route=StepID.LEGEERKLÆRING', () => {
            const result = isAvailable(StepID.LEGEERKLÆRING, formValues);
            expect(stepUtils.legeerklæringStepAvailable).toHaveBeenCalledWith(formValues);
            expect(result).toEqual(stepUtils.legeerklæringStepAvailable(formValues));
        });

        it('should return result from calling medlemskapStepAvailable if route=StepID.MEDLEMSKAP', () => {
            const result = isAvailable(StepID.MEDLEMSKAP, formValues);
            expect(stepUtils.medlemskapStepAvailable).toHaveBeenCalledWith(formValues);
            expect(result).toEqual(stepUtils.medlemskapStepAvailable(formValues));
        });

        it('should return result from calling summaryStepAvailable if route=StepID.SUMMARY', () => {
            const result = isAvailable(StepID.SUMMARY, formValues);
            expect(stepUtils.summaryStepAvailable).toHaveBeenCalledWith(formValues);
            expect(result).toEqual(stepUtils.summaryStepAvailable(formValues));
        });

        it('should return true if route=RouteConfig.SØKNAD_SENDT_ROUTE and harBekreftetOpplysninger is true', () => {
            const result = isAvailable(
                RouteConfig.SØKNAD_SENDT_ROUTE,
                {
                    ...formValues,
                    [AppFormField.harBekreftetOpplysninger]: true,
                },
                true
            );
            expect(result).toBe(true);
        });

        it('should return false if route=RouteConfig.SØKNAD_SENDT_ROUTE and harBekreftetOpplysninger is false', () => {
            const result = isAvailable(
                RouteConfig.SØKNAD_SENDT_ROUTE,
                {
                    ...formValues,
                    [AppFormField.harBekreftetOpplysninger]: false,
                },
                false
            );
            expect(result).toBe(false);
        });

        describe('when running app in development', () => {
            it('should return true if app is running in development', () => {
                process.env.NODE_ENV = 'development';
                expect(isAvailable(StepID.OPPLYSNINGER_OM_BARNET, formValues)).toBe(true);
            });
        });
    });
});
