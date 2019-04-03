import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/routeUtils';
import FormikStep from '../../formik-step/FormikStep';
import { Field } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';

interface MedlemsskapStepProps {
    handleSubmit: () => void;
}

type Props = MedlemsskapStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.MEDLEMSKAP);

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, ...stepProps }) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <YesOrNoQuestion
                legend="Har du bodd i andre land enn Norge i hele eller deler av de siste 12 månedene?"
                name={Field.harBoddUtenforNorgeSiste12Mnd}
                validate={validateYesOrNoIsAnswered}
                helperText="Her vil vi vite om du har oppholdt deg fast i et annet land enn Norge. Korte utenlandsopphold, i forbindelse med f.eks. ferie, telles ikke."
            />
            <YesOrNoQuestion
                legend="Planlegger du å bo i andre land enn Norge i hele eller deler av de neste 12 månedene?"
                name={Field.skalBoUtenforNorgeNeste12Mnd}
                validate={validateYesOrNoIsAnswered}
                helperText="Her vil vi vite om du har planlagt å oppholde deg fast i et annet land enn Norge. Korte utenlandsopphold, i forbindelse med f.eks. ferie, telles ikke."
            />
        </FormikStep>
    );
};

export default MedlemsskapStep;
