import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormField, SøknadFormData } from '../../types/SøknadFormData';
import * as fieldValidations from '../fieldValidations';
import {
    arbeidssituasjonStepIsValid,
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid,
} from '../stepValidations';

import Mock = jest.Mock;
const moment = require('moment');

jest.mock('./../fieldValidations', () => {
    return {
        validateNavn: jest.fn(() => undefined),
        validateFødselsnummer: jest.fn(() => undefined),
        validateValgtBarn: jest.fn(() => undefined),
    };
});

jest.mock('@navikt/sif-common-formik/lib/validation', () => ({
    getDateValidator: () => () => undefined,
    getFødselsnummerValidator: () => () => undefined,
    getStringValidator: () => () => undefined,
}));

jest.mock('./../../utils/featureToggleUtils', () => {
    return { isFeatureEnabled: () => false, Feature: {} };
});

const formData: Partial<SøknadFormData> = {};

describe('stepValidation tests', () => {
    describe('welcomingPageIsValid', () => {
        it(`should be valid if ${SøknadFormField.harForståttRettigheterOgPlikter} is true`, () => {
            formData[SøknadFormField.harForståttRettigheterOgPlikter] = true;
            expect(welcomingPageIsValid(formData as SøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${SøknadFormField.harForståttRettigheterOgPlikter} is undefined or false`, () => {
            formData[SøknadFormField.harForståttRettigheterOgPlikter] = undefined;
            expect(welcomingPageIsValid(formData as SøknadFormData)).toBe(false);
            formData[SøknadFormField.harForståttRettigheterOgPlikter] = false;
            expect(welcomingPageIsValid(formData as SøknadFormData)).toBe(false);
        });
    });

    describe('opplysningerOmBarnetStepIsValid', () => {
        describe(`opplysningerOmBarnetStep test`, () => {
            beforeEach(() => {
                jest.resetAllMocks();
            });

            it('should be valid if barnetsNavn, barnetsFødselsnummer and are all valid', () => {
                expect(opplysningerOmBarnetStepIsValid(formData as SøknadFormData)).toBe(true);
            });

            it(`should be invalid if ${SøknadFormField.barnetsNavn} is invalid`, () => {
                (fieldValidations.validateNavn as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as SøknadFormData)).toBe(false);
            });

            it(`should be invalid if ${SøknadFormField.barnetsFødselsnummer} is invalid`, () => {
                (fieldValidations.validateFødselsnummer as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as SøknadFormData)).toBe(false);
            });
        });
    });

    describe('opplysningerOmTidsromStepIsValid', () => {
        it(`should be valid if both ${SøknadFormField.periodeFra} and ${SøknadFormField.periodeTil} are defined`, () => {
            formData[SøknadFormField.periodeFra] = moment().toDate();
            formData[SøknadFormField.periodeTil] = moment().toDate();
            expect(opplysningerOmTidsromStepIsValid(formData as SøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${SøknadFormField.periodeFra} is undefined`, () => {
            formData[SøknadFormField.periodeFra] = undefined;
            formData[SøknadFormField.periodeTil] = moment().toDate();
            expect(opplysningerOmTidsromStepIsValid(formData as SøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${SøknadFormField.periodeTil} is undefined`, () => {
            formData[SøknadFormField.periodeFra] = moment().toDate();
            formData[SøknadFormField.periodeTil] = undefined;
            expect(opplysningerOmTidsromStepIsValid(formData as SøknadFormData)).toBe(false);
        });
    });

    describe('opplysningerOmTidsromStepIsValid', () => {
        it('should always be valid', () => {
            expect(arbeidssituasjonStepIsValid()).toBe(true);
        });
    });

    describe('medlemskapStepIsValid', () => {
        it('should be valid if both harBoddUtenforNorgeSiste12Mnd and skalBoUtenforNorgeNeste12Mnd are either answered with YES or NO', () => {
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${SøknadFormField.harBoddUtenforNorgeSiste12Mnd} is UNANSWERED`, () => {
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.UNANSWERED;
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${SøknadFormField.skalBoUtenforNorgeNeste12Mnd} is UNANSWERED`, () => {
            formData[SøknadFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.UNANSWERED;
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
            formData[SøknadFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as SøknadFormData)).toBe(false);
        });
    });

    describe('legeerklæringStepIsValid', () => {
        it('should always be valid', () => {
            expect(legeerklæringStepIsValid()).toBe(true);
        });
    });
});
