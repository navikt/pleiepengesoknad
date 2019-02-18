import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/routeUtils';
import FormikStep from '../../formik-step/FormikStep';
import { Field } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';

interface MedlemsskapStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = MedlemsskapStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.MEDLEMSSKAP);

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, ...stepProps }) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.MEDLEMSSKAP} onValidFormSubmit={navigate} {...stepProps}>
            <YesOrNoQuestion
                legend="Har du bodd i andre land enn Norge i hele eller deler av de siste 12 månedene?"
                name={Field.barnetSøknadenGjelder}
            />

            <YesOrNoQuestion
                legend="Planlegger du å bo i andre land enn Norge i hele eller deler av de neste 12 månedene?"
                name={Field.barnetSøknadenGjelder}
            />
        </FormikStep>
    );
};

export default MedlemsskapStep;
