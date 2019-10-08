import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from '../../../types/History';
import FormikStep from '../../formik-step/FormikStep';
import { Field } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import { validateYesOrNoIsAnswered } from '../../../validation/fieldValidations';
import intlHelper from 'app/utils/intlUtils';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import Box from 'app/components/box/Box';
import { CustomFormikProps } from '../../../types/FormikProps';
import { YesOrNo } from '../../../types/YesOrNo';
import Textarea from '../../textarea/Textarea';

interface StepProps {
    formikProps: CustomFormikProps;
    handleSubmit: () => void;
}

type Props = StepProps & HistoryProps & WrappedComponentProps & StepConfigProps;

const NattevåkOgBeredskapStep: React.FunctionComponent<Props> = ({
    history,
    intl,
    formikProps: { values },
    nextStepRoute,
    ...stepProps
}) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { harNattevåk, harBeredskap } = values;
    return (
        <FormikStep
            id={StepID.NATTEVÅK_OG_BEREDSKAP}
            onValidFormSubmit={navigate}
            history={history}
            {...stepProps}
            formValues={values}>
            <YesOrNoQuestion
                legend={intlHelper(intl, 'steg.nattevåkOgBeredskap.nattevåk.spm')}
                name={Field.harNattevåk}
                validate={validateYesOrNoIsAnswered}
            />
            {harNattevåk === YesOrNo.YES && (
                <Box margin="xl">
                    <Textarea
                        name={Field.harNattevåk_ekstrainfo}
                        label={intlHelper(intl, 'steg.nattevåkOgBeredskap.nattevåk.tilleggsinfo.spm')}
                        maxLength={1000}
                    />
                </Box>
            )}
            <Box margin="xl">
                <YesOrNoQuestion
                    legend={intlHelper(intl, 'steg.nattevåkOgBeredskap.beredskap.spm')}
                    name={Field.harBeredskap}
                    validate={validateYesOrNoIsAnswered}
                />
                {harBeredskap === YesOrNo.YES && (
                    <Box margin="xl">
                        <Textarea
                            name={Field.harBeredskap_ekstrainfo}
                            label={intlHelper(intl, 'steg.nattevåkOgBeredskap.beredskap.tilleggsinfo.spm')}
                            maxLength={1000}
                        />
                    </Box>
                )}
            </Box>
        </FormikStep>
    );
};

export default injectIntl(NattevåkOgBeredskapStep);
