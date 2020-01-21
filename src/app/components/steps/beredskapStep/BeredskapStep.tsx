import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered, validateBeredskapTilleggsinfo } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { WrappedComponentProps, injectIntl, FormattedMessage } from 'react-intl';
import Box from 'common/components/box/Box';
import { CustomFormikProps } from '../../../types/FormikProps';
import { YesOrNo } from 'common/types/YesOrNo';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import Textarea from 'app/components/textarea/Textarea';

interface StepProps {
    formikProps: CustomFormikProps;
    handleSubmit: () => void;
}

type Props = StepProps & HistoryProps & WrappedComponentProps & StepConfigProps;

const BeredskapStep: React.FunctionComponent<Props> = ({
    history,
    intl,
    formikProps: { values },
    nextStepRoute,
    ...stepProps
}) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { harBeredskap } = values;
    return (
        <FormikStep
            id={StepID.BEREDSKAP}
            onValidFormSubmit={navigate}
            history={history}
            {...stepProps}
            formValues={values}>
            <Box padBottom="xxl">
                <CounsellorPanel>
                    <FormattedMessage id="steg.beredskap.veileder" />
                </CounsellorPanel>
            </Box>
            <YesOrNoQuestion
                legend={intlHelper(intl, 'steg.beredskap.spm')}
                name={AppFormField.harBeredskap}
                validate={validateYesOrNoIsAnswered}
            />
            {harBeredskap === YesOrNo.YES && (
                <Box margin="xl">
                    <Textarea
                        name={AppFormField.harBeredskap_ekstrainfo}
                        label={intlHelper(intl, 'steg.beredskap.tilleggsinfo.spm')}
                        maxLength={1000}
                        validate={validateBeredskapTilleggsinfo}
                    />
                </Box>
            )}
        </FormikStep>
    );
};

export default injectIntl(BeredskapStep);
