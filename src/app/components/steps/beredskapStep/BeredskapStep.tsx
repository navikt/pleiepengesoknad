import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import FormikYesOrNoQuestion from '../../../../common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import { validateBeredskapTilleggsinfo } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { YesOrNo } from 'common/types/YesOrNo';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikTextarea from 'common/formik/formik-textarea/FormikTextarea';
import { validateYesOrNoIsAnswered } from 'common/validation/commonFieldValidations';
import { persistAndNavigateTo } from 'app/utils/navigationUtils';

interface StepProps {
    formikProps: PleiepengesøknadFormikProps;
    handleSubmit: () => void;
}

type Props = StepProps & HistoryProps & StepConfigProps;

const BeredskapStep: React.FunctionComponent<Props> = ({
    history,
    formikProps: { values },
    nextStepRoute,
    ...stepProps
}) => {
    const { harBeredskap } = values;
    const intl = useIntl();

    return (
        <FormikStep
            id={StepID.BEREDSKAP}
            onValidFormSubmit={() => persistAndNavigateTo(history, StepID.BEREDSKAP, values, nextStepRoute)}
            history={history}
            {...stepProps}
            formValues={values}>
            <Box padBottom="xxl">
                <CounsellorPanel>
                    <FormattedMessage id="steg.beredskap.veileder" />
                </CounsellorPanel>
            </Box>
            <FormikYesOrNoQuestion
                legend={intlHelper(intl, 'steg.beredskap.spm')}
                name={AppFormField.harBeredskap}
                validate={validateYesOrNoIsAnswered}
            />
            {harBeredskap === YesOrNo.YES && (
                <Box margin="xl">
                    <FormikTextarea<AppFormField>
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

export default BeredskapStep;
