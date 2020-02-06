import {
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    arbeidsforholdStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid
} from '../stepValidations';
import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import * as fieldValidations from './../fieldValidations';
import Mock = jest.Mock;
import { YesOrNo } from 'common/types/YesOrNo';
import { validateFødselsnummer } from 'common/validation/fieldValidations';
const moment = require('moment');

jest.mock('./../fieldValidations', () => {
    return {
        validateRelasjonTilBarnet: jest.fn(() => undefined),
        validateNavn: jest.fn(() => undefined),
        validateFødselsnummer: jest.fn(() => undefined),
        validateValgtBarn: jest.fn(() => undefined)
    };
});

jest.mock('common/validation/fieldValidations', () => {
    return {
        validateFødselsnummer: jest.fn(() => undefined)
    };
});

jest.mock('./../../utils/featureToggleUtils', () => {
    return { isFeatureEnabled: () => false, Feature: {} };
});

const formData: Partial<PleiepengesøknadFormData> = {};

describe('stepValidation tests', () => {
    describe('welcomingPageIsValid', () => {
        it(`should be valid if ${AppFormField.harForståttRettigheterOgPlikter} is true`, () => {
            formData[AppFormField.harForståttRettigheterOgPlikter] = true;
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${AppFormField.harForståttRettigheterOgPlikter} is undefined or false`, () => {
            formData[AppFormField.harForståttRettigheterOgPlikter] = undefined;
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            formData[AppFormField.harForståttRettigheterOgPlikter] = false;
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });
    });

    describe('opplysningerOmBarnetStepIsValid', () => {
        describe(`when ${AppFormField.barnetHarIkkeFåttFødselsnummerEnda} is true`, () => {
            beforeEach(() => {
                formData[AppFormField.barnetHarIkkeFåttFødselsnummerEnda] = true;
            });

            it(`should be invalid if ${AppFormField.søkersRelasjonTilBarnet} is invalid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });

            it(`should be valid if ${AppFormField.søkersRelasjonTilBarnet} is valid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue(undefined);
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            });
        });

        describe(`when ${AppFormField.barnetHarIkkeFåttFødselsnummerEnda} is false`, () => {
            beforeEach(() => {
                formData[AppFormField.barnetHarIkkeFåttFødselsnummerEnda] = false;
                jest.resetAllMocks();
            });

            it('should be valid if barnetsNavn, barnetsFødselsnummer and are all valid', () => {
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            });

            it(`should be invalid if ${AppFormField.barnetsNavn} is invalid`, () => {
                (fieldValidations.validateNavn as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });

            it(`should be invalid if ${AppFormField.barnetsFødselsnummer} is invalid`, () => {
                (validateFødselsnummer as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });

            it(`should be invalid if ${AppFormField.søkersRelasjonTilBarnet} is invalid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });
        });
    });

    describe('opplysningerOmTidsromStepIsValid', () => {
        it(`should be valid if both ${AppFormField.periodeFra} and ${AppFormField.periodeTil} are defined`, () => {
            formData[AppFormField.periodeFra] = moment().toDate();
            formData[AppFormField.periodeTil] = moment().toDate();
            expect(opplysningerOmTidsromStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${AppFormField.periodeFra} is undefined`, () => {
            formData[AppFormField.periodeFra] = undefined;
            formData[AppFormField.periodeTil] = moment().toDate();
            expect(opplysningerOmTidsromStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${AppFormField.periodeTil} is undefined`, () => {
            formData[AppFormField.periodeFra] = moment().toDate();
            formData[AppFormField.periodeTil] = undefined;
            expect(opplysningerOmTidsromStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });
    });

    describe('opplysningerOmTidsromStepIsValid', () => {
        it('should always be valid', () => {
            expect(arbeidsforholdStepIsValid()).toBe(true);
        });
    });

    describe('medlemskapStepIsValid', () => {
        it('should be valid if both harBoddUtenforNorgeSiste12Mnd and skalBoUtenforNorgeNeste12Mnd are either answered with YES or NO', () => {
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${AppFormField.harBoddUtenforNorgeSiste12Mnd} is UNANSWERED`, () => {
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.UNANSWERED;
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${AppFormField.skalBoUtenforNorgeNeste12Mnd} is UNANSWERED`, () => {
            formData[AppFormField.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.UNANSWERED;
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            formData[AppFormField.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });
    });

    describe('legeerklæringStepIsValid', () => {
        it('should always be valid', () => {
            expect(legeerklæringStepIsValid()).toBe(true);
        });
    });
});
