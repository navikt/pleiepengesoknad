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

interface StepProps {
    formikProps: CustomFormikProps;
    handleSubmit: () => void;
}

type Props = StepProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const NattevåkStep: React.FunctionComponent<Props> = ({
    history,
    intl,
    formikProps: { values },
    nextStepRoute,
    ...stepProps
}) => {
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { harNattevåk, harNattevåk_borteFraJobb } = values;
    return (
        <FormikStep
            id={StepID.NATTEVÅK}
            onValidFormSubmit={navigate}
            history={history}
            {...stepProps}
            formValues={values}>
            <YesOrNoQuestion
                legend={intlHelper(intl, 'steg.nattevåk.spm')}
                name={Field.harNattevåk}
                validate={validateYesOrNoIsAnswered}
            />
            {harNattevåk === YesOrNo.YES && (
                <>
                    <YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.nattevåk.borteFraJobb.spm')}
                        name={Field.harNattevåk_borteFraJobb}
                        validate={validateYesOrNoIsAnswered}
                    />
                    {harNattevåk_borteFraJobb === YesOrNo.YES && (
                        <Box margin="xl">
                            <Textarea
                                name={Field.harNattevåk_ekstrainfo}
                                label={intlHelper(intl, 'steg.nattevåk.tilleggsinfo.spm')}
                                maxLength={1000}
                                validate={validateRequiredField}
                            />
                        </Box>
                    )}
                </>
            )}
        </FormikStep>
    );
};

export default injectIntl(NattevåkStep);
