import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import {
    QuestionConfig, Questions
} from '../../../pre-common/question-visibility/questions/Questions';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';

const isYesOrNoAnswered = (answer: YesOrNo) => {
    return answer === YesOrNo.NO || answer === YesOrNo.YES || answer === YesOrNo.DO_NOT_KNOW;
};

const medlemsskapQuestionConfig: QuestionConfig<PleiepengesøknadFormData, AppFormField> = {
    [AppFormField.harBoddUtenforNorgeSiste12Mnd]: {
        isAnswered: ({ harBoddUtenforNorgeSiste12Mnd }) => isYesOrNoAnswered(harBoddUtenforNorgeSiste12Mnd)
    },
    [AppFormField.utenlandsoppholdSiste12Mnd]: {
        isIncluded: ({ harBoddUtenforNorgeSiste12Mnd }) => harBoddUtenforNorgeSiste12Mnd === YesOrNo.YES,
        isAnswered: ({ utenlandsoppholdSiste12Mnd }) => utenlandsoppholdSiste12Mnd.length > 0
    },
    [AppFormField.skalBoUtenforNorgeNeste12Mnd]: {
        isAnswered: ({ skalBoUtenforNorgeNeste12Mnd }) => isYesOrNoAnswered(skalBoUtenforNorgeNeste12Mnd)
    },
    [AppFormField.utenlandsoppholdNeste12Mnd]: {
        isIncluded: ({ skalBoUtenforNorgeNeste12Mnd }) => skalBoUtenforNorgeNeste12Mnd === YesOrNo.YES,
        isAnswered: ({ utenlandsoppholdNeste12Mnd }) => utenlandsoppholdNeste12Mnd.length > 0
    }
};

export const medlemskapQuestions = Questions<PleiepengesøknadFormData, AppFormField>(medlemsskapQuestionConfig);
