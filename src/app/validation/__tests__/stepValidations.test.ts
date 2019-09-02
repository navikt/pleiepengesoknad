import {
    legeerklæringStepIsValid,
    medlemskapStepIsValid,
    opplysningerOmAnsettelsesforholdStepIsValid,
    opplysningerOmBarnetStepIsValid,
    opplysningerOmTidsromStepIsValid,
    welcomingPageIsValid
} from '../stepValidations';
import { Field, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import * as fieldValidations from './../fieldValidations';
import Mock = jest.Mock;
import { YesOrNo } from '../../types/YesOrNo';
const moment = require('moment');

jest.mock('./../fieldValidations', () => {
    return {
        validateRelasjonTilBarnet: jest.fn(() => undefined),
        validateNavn: jest.fn(() => undefined),
        validateFødselsnummer: jest.fn(() => undefined),
        validateValgtBarn: jest.fn(() => undefined)
    };
});

jest.mock('./../../utils/featureToggleUtils', () => {
    return { isFeatureEnabled: () => false, Feature: {} };
});

const formData: Partial<PleiepengesøknadFormData> = {};

describe('stepValidation tests', () => {
    describe('welcomingPageIsValid', () => {
        it(`should be valid if ${Field.harForståttRettigheterOgPlikter} is true`, () => {
            formData[Field.harForståttRettigheterOgPlikter] = true;
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${Field.harForståttRettigheterOgPlikter} is undefined or false`, () => {
            formData[Field.harForståttRettigheterOgPlikter] = undefined;
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            formData[Field.harForståttRettigheterOgPlikter] = false;
            expect(welcomingPageIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });
    });

    describe('opplysningerOmBarnetStepIsValid', () => {
        describe(`when ${Field.barnetHarIkkeFåttFødselsnummerEnda} is true`, () => {
            beforeEach(() => {
                formData[Field.barnetHarIkkeFåttFødselsnummerEnda] = true;
            });

            it(`should be invalid if ${Field.søkersRelasjonTilBarnet} is invalid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });

            it(`should be valid if ${Field.søkersRelasjonTilBarnet} is valid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue(undefined);
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            });
        });

        describe(`when ${Field.barnetHarIkkeFåttFødselsnummerEnda} is false`, () => {
            beforeEach(() => {
                formData[Field.barnetHarIkkeFåttFødselsnummerEnda] = false;
                jest.resetAllMocks();
            });

            it('should be valid if barnetsNavn, barnetsFødselsnummer and are all valid', () => {
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            });

            it(`should be invalid if ${Field.barnetsNavn} is invalid`, () => {
                (fieldValidations.validateNavn as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });

            it(`should be invalid if ${Field.barnetsFødselsnummer} is invalid`, () => {
                (fieldValidations.validateFødselsnummer as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });

            it(`should be invalid if ${Field.søkersRelasjonTilBarnet} is invalid`, () => {
                (fieldValidations.validateRelasjonTilBarnet as Mock).mockReturnValue('some error message');
                expect(opplysningerOmBarnetStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            });
        });
    });

    describe('opplysningerOmTidsromStepIsValid', () => {
        it(`should be valid if both ${Field.periodeFra} and ${Field.periodeTil} are defined`, () => {
            formData[Field.periodeFra] = moment().toDate();
            formData[Field.periodeTil] = moment().toDate();
            expect(opplysningerOmTidsromStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${Field.periodeFra} is undefined`, () => {
            formData[Field.periodeFra] = undefined;
            formData[Field.periodeTil] = moment().toDate();
            expect(opplysningerOmTidsromStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${Field.periodeTil} is undefined`, () => {
            formData[Field.periodeFra] = moment().toDate();
            formData[Field.periodeTil] = undefined;
            expect(opplysningerOmTidsromStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });
    });

    describe('opplysningerOmTidsromStepIsValid', () => {
        it('should always be valid', () => {
            expect(opplysningerOmAnsettelsesforholdStepIsValid()).toBe(true);
        });
    });

    describe('medlemskapStepIsValid', () => {
        it('should be valid if both harBoddUtenforNorgeSiste12Mnd and skalBoUtenforNorgeNeste12Mnd are either answered with YES or NO', () => {
            formData[Field.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[Field.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            formData[Field.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[Field.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            formData[Field.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            formData[Field.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
            formData[Field.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            formData[Field.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(true);
        });

        it(`should be invalid if ${Field.harBoddUtenforNorgeSiste12Mnd} is UNANSWERED`, () => {
            formData[Field.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.UNANSWERED;
            formData[Field.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            formData[Field.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });

        it(`should be invalid if ${Field.skalBoUtenforNorgeNeste12Mnd} is UNANSWERED`, () => {
            formData[Field.skalBoUtenforNorgeNeste12Mnd] = YesOrNo.UNANSWERED;
            formData[Field.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.YES;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
            formData[Field.harBoddUtenforNorgeSiste12Mnd] = YesOrNo.NO;
            expect(medlemskapStepIsValid(formData as PleiepengesøknadFormData)).toBe(false);
        });
    });

    describe('legeerklæringStepIsValid', () => {
        it('should always be valid', () => {
            expect(legeerklæringStepIsValid()).toBe(true);
        });
    });
});
