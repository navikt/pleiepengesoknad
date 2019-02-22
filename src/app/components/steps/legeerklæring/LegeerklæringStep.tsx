import * as React from 'react';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { navigateTo } from '../../../utils/navigationUtils';
import FormikStep from '../../formik-step/FormikStep';
import LegeerklæringFileList from '../../legeerklæring-file-list/LegeerklæringFileList';
import FormikFileUploader from '../../formik-file-uploader/FormikFileUploader';
import { getNextStepRoute } from '../../../utils/routeUtils';
import { Field } from '../../../types/PleiepengesøknadFormData';

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
            <FormikFileUploader name={Field.legeerklæring} label="Last opp din legeerklæring her" />
            <LegeerklæringFileList />
        </FormikStep>
    );
};

export default LegeerklæringStep;
