import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import { validateYesOrNoIsAnswered } from '@sif-common/core/validation/fieldValidations';
import { FieldValidationResult } from '@sif-common/core/validation/types';
import { QuestionConfig, Questions } from '../../../pre-common/question-visibility/questions/Questions';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';

const medlemsskapQuestionConfig: QuestionConfig<PleiepengesøknadFormData, AppFormField, FieldValidationResult> = {
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: {
        isAnswered: ({ harBoddUtenforNorgeSiste12Mnd }) => isYesOrNoAnswered(harBoddUtenforNorgeSiste12Mnd),
        validate: ({ harBoddUtenforNorgeSiste12Mnd }) => validateYesOrNoIsAnswered(harBoddUtenforNorgeSiste12Mnd),
    },
    [AppFormField.utenlandsoppholdSiste12Mnd]: {
        isIncluded: ({ harBoddUtenforNorgeSiste12Mnd }) => harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
        isAnswered: ({ utenlandsoppholdSiste12Mnd }) => utenlandsoppholdSiste12Mnd.length > 0,
    },
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: {
        isAnswered: ({ skalBoUtenforNorgeNeste12Mnd }) => isYesOrNoAnswered(skalBoUtenforNorgeNeste12Mnd),
        validate: ({ skalBoUtenforNorgeNeste12Mnd }) => validateYesOrNoIsAnswered(skalBoUtenforNorgeNeste12Mnd),
    },
    [AppFormField.utenlandsoppholdNeste12Mnd]: {
        isIncluded: ({ skalBoUtenforNorgeNeste12Mnd }) => skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
        isAnswered: ({ utenlandsoppholdNeste12Mnd }) => utenlandsoppholdNeste12Mnd.length > 0,
    },
};

export const medlemskapQuestions = Questions<PleiepengesøknadFormData, AppFormField, FieldValidationResult>(
    medlemsskapQuestionConfig
);
