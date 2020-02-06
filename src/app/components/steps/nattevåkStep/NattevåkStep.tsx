import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import FormikYesOrNoQuestion from '../../../../common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { validateNattevåkTilleggsinfo } from '../../../validation/fieldValidations';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { useIntl } from 'react-intl';
import Box from 'common/components/box/Box';
import { PleiepengesøknadFormikProps } from '../../../types/PleiepengesøknadFormikProps';
import { YesOrNo } from 'common/types/YesOrNo';
import FormikTextarea from 'common/formik/formik-textarea/FormikTextarea';
import { validateYesOrNoIsAnswered } from 'common/validation/commonFieldValidations';
import { persistAndNavigateTo } from 'app/utils/navigationUtils';

interface StepProps {
    formikProps: PleiepengesøknadFormikProps;
    handleSubmit: () => void;
}

type Props = StepProps & HistoryProps & StepConfigProps;

const NattevåkStep: React.FunctionComponent<Props> = ({
    history,
    formikProps: { values },
    nextStepRoute,
    ...stepProps
}) => {
    const intl = useIntl();
    const { harNattevåk } = values;
    return (
        <FormikStep
            id={StepID.NATTEVÅK}
            onValidFormSubmit={() => persistAndNavigateTo(history, StepID.NATTEVÅK, values, nextStepRoute)}
            history={history}
            {...stepProps}
            formValues={values}>
            <FormikYesOrNoQuestion
                legend={intlHelper(intl, 'steg.nattevåk.spm')}
                name={AppFormField.harNattevåk}
                validate={validateYesOrNoIsAnswered}
            />
            {harNattevåk === YesOrNo.YES && (
                <Box margin="xl">
                    <FormikTextarea<AppFormField>
                        name={AppFormField.harNattevåk_ekstrainfo}
                        label={intlHelper(intl, 'steg.nattevåk.tilleggsinfo.spm')}
                        validate={validateNattevåkTilleggsinfo}
                        maxLength={1000}
                    />
                </Box>
            )}
        </FormikStep>
    );
};

export default NattevåkStep;
