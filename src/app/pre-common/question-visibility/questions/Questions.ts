export type QuestionValue = string | number | Date | boolean | undefined;

export const questionValueIsOk = (value: QuestionValue) => {
    return value !== undefined && value !== '';
};

export interface QuestionConfig<Payload, QuestionKeys, ErrorFormat = any> {
    [key: string]: {
        /** Depends on parentQuestions visibility, so if parent is hidden,
         * this is hidden too */
        parentQuestion?: QuestionKeys;
        /** Should question be included in the form. Is not the same as
         * visiblity, since it might be included, but it is still not visible because
         * parent is not visible, or visibilityFilter is active  */
        isIncluded?: (props: Payload) => boolean;
        /** Is the question answered */
        isAnswered: (props: Payload) => boolean;
        /** Is it ok if the question is not answered. Used when running isAllQuestionsAnswered */
        isOptional?: (props: Payload) => boolean;
        /** Additional feature for toggling visibility of the question */
        visibilityFilter?: (props: Payload) => boolean;
        /** Fieldvalidation */
        validate?: (props: Payload) => boolean | ErrorFormat | ErrorFormat[];
    };
}

const isQuestionVisible = <Payload, QuestionKeys, ErrorFormat>(
    questions: QuestionConfig<Payload, QuestionKeys, ErrorFormat>,
    question: QuestionKeys,
    payload: Payload
): boolean => {
    const config = questions[question as any];
    if (!config) {
        return false;
    }
    if (config.isIncluded && config.isIncluded(payload) === false) {
        return false;
    }
    if (config.visibilityFilter && config.visibilityFilter(payload) === false) {
        return false;
    }
    if (config.parentQuestion !== undefined) {
        const parentQuestion = questions[config.parentQuestion as any];
        return isQuestionVisible(questions, config.parentQuestion, payload) && parentQuestion.isAnswered(payload);
    }
    return true;
};

const isQuestionAnswered = <Payload, QuestionKeys, ErrorFormat>(
    questions: QuestionConfig<Payload, QuestionKeys, ErrorFormat>,
    question: QuestionKeys,
    payload: Payload
): boolean => {
    const config = questions[question as any];
    if (!config || !config.isAnswered) {
        return false;
    }
    return config.isAnswered(payload);
};

const areAllQuestionsAnswered = <Payload, QuestionKeys, ErrorFormat>(
    questions: QuestionConfig<Payload, QuestionKeys, ErrorFormat>,
    payload: Payload
): boolean => {
    let allQuestionsHasAnswers = true;
    Object.keys(questions).forEach((key) => {
        const question = questions[key];
        if (isQuestionVisible<Payload, QuestionKeys, ErrorFormat>(questions, key as any, payload)) {
            const isOptional = question.isOptional !== undefined ? question.isOptional(payload) === true : false;
            allQuestionsHasAnswers = allQuestionsHasAnswers === true && (question.isAnswered(payload) || isOptional);
        }
    });
    return allQuestionsHasAnswers;
};

export interface QuestionVisibility<QuestionKeys> {
    isVisible: (key: QuestionKeys) => boolean;
    isAnswered: (key: QuestionKeys) => boolean;
    areAllQuestionsAnswered: () => boolean;
}

export const Questions = <Payload, QuestionKeys, ErrorFormat = undefined>(
    questions: QuestionConfig<Payload, QuestionKeys, ErrorFormat>
) => ({
    getVisbility: (payload: Payload): QuestionVisibility<QuestionKeys> => ({
        isVisible: (key: QuestionKeys) => isQuestionVisible(questions, key, payload),
        isAnswered: (key: QuestionKeys) => isQuestionAnswered(questions, key, payload),
        areAllQuestionsAnswered: () => areAllQuestionsAnswered(questions, payload)
    })
});
