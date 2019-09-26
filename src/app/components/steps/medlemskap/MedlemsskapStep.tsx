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
import { WrappedComponentProps, injectIntl } from 'react-intl';
import Box from 'app/components/box/Box';

interface MedlemsskapStepProps {
    handleSubmit: () => void;
}

type Props = MedlemsskapStepProps & HistoryProps & WrappedComponentProps;
const nextStepRoute = getNextStepRoute(StepID.MEDLEMSKAP);

const MedlemsskapStep: React.FunctionComponent<Props> = ({ history, intl, ...stepProps }) => {
    const navigate = () => navigateTo(nextStepRoute!, history);
    return (
        <FormikStep id={StepID.MEDLEMSKAP} onValidFormSubmit={navigate} history={history} {...stepProps}>
            <Box padBottom="m">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.spm')}
                    name={Field.harBoddUtenforNorgeSiste12Mnd}
                    validate={validateYesOrNoIsAnswered}
                    helperText={intlHelper(intl, 'steg.medlemsskap.annetLandSiste12.hjelp')}
                />
            </Box>
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
