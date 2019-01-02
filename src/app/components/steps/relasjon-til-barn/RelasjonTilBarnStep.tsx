import * as React from 'react';
import Step from '../../step/Step';
import { stepConfig, StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { Field } from 'formik';
import { PleiepengerFormdata } from '../../pleiepengesøknad/Pleiepengesøknad';
import { History } from 'history';

export interface RelasjonTilBarnStepProps {
    values: PleiepengerFormdata;
}

type Props = RelasjonTilBarnStepProps & HistoryProps;

const onSubmit = (history: History) => {
    history.push(`/soknad/${stepConfig[StepID.RELASJON_TIL_BARN].nextStep}`);
};

const RelasjonTilBarnStep: React.FunctionComponent<Props> = ({ history }) => (
    <form onSubmit={() => onSubmit(history)}>
        <Step id={StepID.RELASJON_TIL_BARN}>
            <Field type="email" name="email" placeholder="Email" />
        </Step>
    </form>
);

export default RelasjonTilBarnStep;
