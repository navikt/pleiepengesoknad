import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../../../common/components/yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered, validateBeredskapTilleggsinfo } from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { YesOrNo } from 'common/types/YesOrNo';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikTextarea from 'common/formik/formik-textarea/FormikTextarea';
import { persist } from '../../../api/api';

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
    const persistAndNavigateTo = ( lastStepID: StepID, data: PleiepengesøknadFormData, nextStep?: string) => {
        persist(data, lastStepID);
        if (nextStep) {
            history.push(nextStep)
        }
    };

    const { harBeredskap } = values;
    const intl = useIntl();

    return (
        <FormikStep
            id={StepID.BEREDSKAP}
            onValidFormSubmit={() => persistAndNavigateTo(StepID.BEREDSKAP, values, nextStepRoute)}
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
