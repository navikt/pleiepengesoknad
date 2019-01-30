import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';
import { navigateTo } from '../../../utils/navigationHelper';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileUploader from '../../legeerklæring-file-uploader/LegeerklæringFileUploader';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';

interface LegeerklæringStepProps {
    isValid: boolean;
    isSubmitting: boolean;
    handleSubmit: () => void;
}

type Props = LegeerklæringStepProps & HistoryProps;
const nextStepRoute = getNextStepRoute(StepID.LEGEERKLÆRING);

const LegeerklæringStep = ({ history, ...stepProps }: Props) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.LEGEERKLÆRING} onValidFormSubmit={navigate} {...stepProps}>
            <LegeerklæringFileUploader label="Last opp din legeerklæring her" />
            <LegeerklæringFileList />
        </FormikStep>
    );
};

export default LegeerklæringStep;
