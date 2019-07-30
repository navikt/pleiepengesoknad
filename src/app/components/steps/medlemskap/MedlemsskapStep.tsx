import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import { getNextStepRoute } from '../../../utils/routeUtils';
import FormikStep from '../../formik-step/FormikStep';
import { Field } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';

interface MedlemsskapStepProps {
    handleSubmit: () => void;
}

type Props = MedlemsskapStepProps & HistoryProps & InjectedIntlProps;
const nextStepRoute = getNextStepRoute(StepID.MEDLEMSKAP);

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, intl, ...stepProps }) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <YesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                name={Field.harBoddUtenforNorgeSiste12Mnd}
                validate={validateYesOrNoIsAnswered}
                helperText={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
            />
            <YesOrNoQuestion
                legend={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.spm')}
                name={Field.skalBoUtenforNorgeNeste12Mnd}
                validate={validateYesOrNoIsAnswered}
                helperText={intlHelper(intl, 'steg.medlemsskap.annetLandNeste12.hjelp')}
            />
        </FormikStep>
    );
};

export default injectIntl(MedlemsskapStep);
