import * as React from 'react';
import Step from '../../step/Step';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field } from 'formik';
import { PleiepengerFormdata } from '../../pleiepengesøknad/Pleiepengesøknad';
import { navigateTo } from '../../../utils/navigationHelper';
import { getNextStepRoute } from '../../../utils/stepConfigHelper';

export interface RelasjonTilBarnStepProps {
    values: PleiepengerFormdata;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

type Props = RelasjonTilBarnStepProps & HistoryProps;

const nextStepRoute = getNextStepRoute(StepID.RELASJON_TIL_BARN);
const RelasjonTilBarnStep: React.FunctionComponent<Props> = ({ onSubmit, history }) => (
    <Step
        id={StepID.RELASJON_TIL_BARN}
        onSubmit={(e) => {
            onSubmit(e);
            navigateTo(nextStepRoute!, history);
        }}>
        <Field type="text" name="someField1" placeholder="Some field 1" />
    </Step>
);

export default RelasjonTilBarnStep;
