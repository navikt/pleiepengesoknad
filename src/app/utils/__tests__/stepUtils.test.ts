import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../../types/SøknadFormData';
import * as stepValidations from '../../validation/stepValidations';
import * as stepUtils from '../stepUtils';

jest.mock('./../../validation/stepValidations', () => {
    return {
        welcomingPageIsValid: jest.fn(() => true),
        opplysningerOmBarnetStepIsValid: jest.fn(() => true),
        opplysningerOmTidsromStepIsValid: jest.fn(() => true),
        arbeidssituasjonStepIsValid: jest.fn(() => true),
        medlemskapStepIsValid: jest.fn(() => true),
        legeerklæringStepIsValid: jest.fn(() => true),
    };
});

const formData: Partial<SøknadFormData> = {};

describe('stepUtils', () => {
    describe('opplysningerOmBarnetStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.opplysningerOmBarnetStepAvailable(formData as SøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(stepValidations.welcomingPageIsValid({} as any));
        });
    });

    describe('opplysningerOmTidsromStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.opplysningerOmTidsromStepAvailable(formData as SøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any)
            );
        });
    });

    describe('arbeidssituasjonStepIsValid', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.arbeidssituasjonStepAvailable(formData as SøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmTidsromStepIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.opplysningerOmTidsromStepIsValid({} as any)
            );
        });
    });

    describe('medlemskapStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.medlemskapStepAvailable(formData as SøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmTidsromStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.arbeidssituasjonStepIsValid).toHaveBeenCalled();
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.opplysningerOmTidsromStepIsValid({} as any) &&
                    stepValidations.arbeidssituasjonStepIsValid()
            );
        });
    });

    describe('legeerklæringStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.legeerklæringStepAvailable(formData as SøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmTidsromStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.arbeidssituasjonStepIsValid).toHaveBeenCalled();
            expect(stepValidations.medlemskapStepIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.opplysningerOmTidsromStepIsValid({} as any) &&
                    stepValidations.arbeidssituasjonStepIsValid() &&
                    stepValidations.medlemskapStepIsValid({} as any)
            );
        });
    });

    describe('summaryStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = stepUtils.summaryStepAvailable(formData as SøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmTidsromStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.arbeidssituasjonStepIsValid).toHaveBeenCalled();
            expect(stepValidations.medlemskapStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.legeerklæringStepIsValid).toHaveBeenCalled();
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.opplysningerOmTidsromStepIsValid({} as any) &&
                    stepValidations.arbeidssituasjonStepIsValid() &&
                    stepValidations.medlemskapStepIsValid({} as any) &&
                    stepValidations.legeerklæringStepIsValid()
            );
        });
    });

    describe('skalBrukerSvarePåBeredskapOgNattevåk', () => {
        it('inkluderer ikke nattevåk/beredskap dersom barnet ikke har vært/skal i tilsyn - 1', () => {
            formData.omsorgstilbud = undefined;
            const returnValue = stepUtils.skalBrukerSvarePåBeredskapOgNattevåk(formData as SøknadFormData);
            expect(returnValue).toBeFalsy();
        });
        it('inkluderer ikke nattevåk/beredskap dersom barnet ikke skal i tilsyn - søker ikke historisk', () => {
            formData.omsorgstilbud = {
                skalBarnIOmsorgstilbud: YesOrNo.NO,
            };
            const returnValue = stepUtils.skalBrukerSvarePåBeredskapOgNattevåk(formData as SøknadFormData);
            expect(returnValue).toBeFalsy();
        });
        it('inkluderer ikke nattevåk/beredskap dersom barnet ikke har vært i tilsyn - søker ikke fremtid', () => {
            formData.omsorgstilbud = {
                harBarnVærtIOmsorgstilbud: YesOrNo.NO,
            };
            const returnValue = stepUtils.skalBrukerSvarePåBeredskapOgNattevåk(formData as SøknadFormData);
            expect(returnValue).toBeFalsy();
        });
        it('inkluderer ikke nattevåk/beredskap dersom barnet ikke har vært i tilsyn - søker både historisk og fremtid', () => {
            formData.omsorgstilbud = {
                harBarnVærtIOmsorgstilbud: YesOrNo.NO,
                skalBarnIOmsorgstilbud: YesOrNo.NO,
            };
            const returnValue = stepUtils.skalBrukerSvarePåBeredskapOgNattevåk(formData as SøknadFormData);
            expect(returnValue).toBeFalsy();
        });
        it('inkluderer nattevåk/beredskap dersom søker historisk', () => {
            formData.omsorgstilbud = {
                harBarnVærtIOmsorgstilbud: YesOrNo.YES,
                historisk: {
                    enkeltdager: {
                        '': { tid: { hours: '1' } },
                    },
                },
            };
            const returnValue = stepUtils.skalBrukerSvarePåBeredskapOgNattevåk(formData as SøknadFormData);
            expect(returnValue).toBeTruthy();
        });
    });
});
