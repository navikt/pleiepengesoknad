import * as React from 'react';
import { useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from '@sif-common/core/components/box/Box';
import { YesOrNo } from '@sif-common/core/types/YesOrNo';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { validateYesOrNoIsAnswered } from '@sif-common/core/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateNattevåkTilleggsinfo } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';

const cleanupNattevåkStep = (values: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const cleanedValues = { ...values };
    if (values.harNattevåk === YesOrNo.NO) {
        // eslint-disable-next-line @typescript-eslint/camelcase
        cleanedValues.harNattevåk_ekstrainfo = undefined;
    }
    return cleanedValues;
};

const NattevåkStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { harNattevåk } = values;
    return (
        <FormikStep id={StepID.NATTEVÅK} onValidFormSubmit={onValidSubmit} onStepCleanup={cleanupNattevåkStep}>
            <AppForm.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.nattevåk.spm')}
                name={AppFormField.harNattevåk}
                validate={validateYesOrNoIsAnswered}
            />
            {harNattevåk === YesOrNo.YES && (
                <Box margin="xl">
                    <AppForm.Textarea
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
