import * as stepValidations from '../../validation/stepValidations';
import {
    legeerklæringStepAvailable,
    medlemsskapStepAvailable,
    opplysningerOmAnsettelsesforholdStepAvailable,
    opplysningerOmBarnetStepAvailable,
    opplysningerOmTidsromStepAvailable,
    summaryStepAvailable
} from '../stepUtils';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

jest.mock('./../../validation/stepValidations', () => {
    return {
        welcomingPageIsValid: jest.fn(() => true),
        opplysningerOmBarnetStepIsValid: jest.fn(() => true),
        opplysningerOmTidsromStepIsValid: jest.fn(() => true),
        opplysningerOmAnsettelsesforholdStepIsValid: jest.fn(() => true),
        medlemsskapStepIsValid: jest.fn(() => true),
        legeerklæringStepIsValid: jest.fn(() => true)
    };
});

const formData: Partial<PleiepengesøknadFormData> = {};

describe('stepUtils', () => {
    describe('opplysningerOmBarnetStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = opplysningerOmBarnetStepAvailable(formData as PleiepengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(stepValidations.welcomingPageIsValid({} as any));
        });
    });

    describe('opplysningerOmTidsromStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = opplysningerOmTidsromStepAvailable(formData as PleiepengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any)
            );
        });
    });

    describe('opplysningerOmAnsettelsesforholdStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = opplysningerOmAnsettelsesforholdStepAvailable(formData as PleiepengesøknadFormData);
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

    describe('medlemsskapStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = medlemsskapStepAvailable(formData as PleiepengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmTidsromStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmAnsettelsesforholdStepIsValid).toHaveBeenCalled();
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.opplysningerOmTidsromStepIsValid({} as any) &&
                    stepValidations.opplysningerOmAnsettelsesforholdStepIsValid()
            );
        });
    });

    describe('legeerklæringStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = legeerklæringStepAvailable(formData as PleiepengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmTidsromStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmAnsettelsesforholdStepIsValid).toHaveBeenCalled();
            expect(stepValidations.medlemsskapStepIsValid).toHaveBeenCalledWith(formData);
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.opplysningerOmTidsromStepIsValid({} as any) &&
                    stepValidations.opplysningerOmAnsettelsesforholdStepIsValid() &&
                    stepValidations.medlemsskapStepIsValid({} as any)
            );
        });
    });

    describe('summaryStepAvailable', () => {
        it('should call relevant stepValidator-functions to determine whether the step should be available', () => {
            const returnValue = summaryStepAvailable(formData as PleiepengesøknadFormData);
            expect(stepValidations.welcomingPageIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmBarnetStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmTidsromStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.opplysningerOmAnsettelsesforholdStepIsValid).toHaveBeenCalled();
            expect(stepValidations.medlemsskapStepIsValid).toHaveBeenCalledWith(formData);
            expect(stepValidations.legeerklæringStepIsValid).toHaveBeenCalled();
            expect(returnValue).toEqual(
                stepValidations.welcomingPageIsValid({} as any) &&
                    stepValidations.opplysningerOmBarnetStepIsValid({} as any) &&
                    stepValidations.opplysningerOmTidsromStepIsValid({} as any) &&
                    stepValidations.opplysningerOmAnsettelsesforholdStepIsValid() &&
                    stepValidations.medlemsskapStepIsValid({} as any) &&
                    stepValidations.legeerklæringStepIsValid()
            );
        });
    });
});
