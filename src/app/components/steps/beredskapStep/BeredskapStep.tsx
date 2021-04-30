import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getStringValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';

const cleanupBeredskapStep = (values: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const cleanedValues = { ...values };
    if (values.harBeredskap === YesOrNo.NO) {
        cleanedValues.harBeredskap_ekstrainfo = undefined;
    }
    return cleanedValues;
};

const BeredskapStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { harBeredskap } = values;

    return (
        <FormikStep id={StepID.BEREDSKAP} onValidFormSubmit={onValidSubmit} onStepCleanup={cleanupBeredskapStep}>
            <Box padBottom="xxl">
                <CounsellorPanel>
                    <FormattedMessage id="steg.beredskap.veileder" />
                </CounsellorPanel>
            </Box>
            <AppForm.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.beredskap.spm')}
                name={AppFormField.harBeredskap}
                validate={getYesOrNoValidator()}
            />
            {harBeredskap === YesOrNo.YES && (
                <Box margin="xl">
                    <AppForm.Textarea
                        name={AppFormField.harBeredskap_ekstrainfo}
                        label={intlHelper(intl, 'steg.beredskap.tilleggsinfo.spm')}
                        maxLength={1000}
                        validate={getStringValidator({ required: true, minLength: 3, maxLength: 1000 })}
                    />
                </Box>
            )}
        </FormikStep>
    );
};

export default BeredskapStep;
