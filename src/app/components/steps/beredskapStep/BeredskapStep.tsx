import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from '@sif-common/core/components/box/Box';
import CounsellorPanel from '@sif-common/core/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@sif-common/core/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateBeredskapTilleggsinfo } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';

const BeredskapStep = ({ onValidSubmit }: StepConfigProps) => {
    const {
        values: { harBeredskap },
    } = useFormikContext<PleiepengesøknadFormData>();
    const intl = useIntl();

    return (
        <FormikStep id={StepID.BEREDSKAP} onValidFormSubmit={onValidSubmit}>
            <Box padBottom="xxl">
                <CounsellorPanel>
                    <FormattedMessage id="steg.beredskap.veileder" />
                </CounsellorPanel>
            </Box>
            <AppForm.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.beredskap.spm')}
                name={AppFormField.harBeredskap}
                validate={validateYesOrNoIsAnswered}
            />
            {harBeredskap === YesOrNo.YES && (
                <Box margin="xl">
                    <AppForm.Textarea
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
