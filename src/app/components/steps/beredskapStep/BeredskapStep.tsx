import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import FormikStep from '../../formik-step/FormikStep';
import { Field } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered, validateRequiredField } from '../../../validation/fieldValidations';
import intlHelper from 'app/utils/intlUtils';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Box from 'app/components/box/Box';
import { CustomFormikProps } from '../../../types/FormikProps';
import { YesOrNo } from '../../../types/YesOrNo';
import Textarea from '../../textarea/Textarea';
import CounsellorPanel from '../../counsellor-panel/CounsellorPanel';

interface StepProps {
    formikProps: CustomFormikProps;
    handleSubmit: () => void;
}

type Props = StepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

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
                    I noen tilfeller kan barnets sykdom gjøre at du må være i beredskap eller være tilgjengelig, selv om
                    barnet er i et omsorgstilbud. Det kan for eksempel være at du må være tilstede i klasserommet, eller
                    at du må reise fra jobb på kort varsel for å være tilgjengelig for barnet ditt. I disse tilfellene
                    vil du som hovedregel få pleiepenger.
                </CounsellorPanel>
            </Box>
            <YesOrNoQuestion
                legend={intlHelper(intl, 'steg.beredskap.spm')}
                name={Field.harBeredskap}
                validate={validateYesOrNoIsAnswered}
            />
            {harBeredskap === YesOrNo.YES && (
                <Box margin="xl">
                    <Textarea
                        name={Field.harBeredskap_ekstrainfo}
                        label={intlHelper(intl, 'steg.beredskap.tilleggsinfo.spm')}
                        validate={validateRequiredField}
                        maxLength={1000}
                    />
                </Box>
            )}
        </FormikStep>
    );
};

export default injectIntl(BeredskapStep);
