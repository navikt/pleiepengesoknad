import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import FormikTextarea from 'common/formik/components/formik-textarea/FormikTextarea';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateNattevåkTilleggsinfo } from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';

const NattevåkStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { harNattevåk } = values;
    return (
        <FormikStep id={StepID.NATTEVÅK} onValidFormSubmit={onValidSubmit}>
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
