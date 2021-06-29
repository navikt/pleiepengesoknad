import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getStringValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

const cleanupNattevåkStep = (values: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const cleanedValues = { ...values };
    if (values.harNattevåk === YesOrNo.NO) {
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
            <Box padBottom="xxl">
                <CounsellorPanel>
                    <FormattedMessage id="steg.nattevåk.veileder" />
                </CounsellorPanel>
            </Box>
            <AppForm.YesOrNoQuestion
                legend={intlHelper(intl, 'steg.nattevåk.spm')}
                name={AppFormField.harNattevåk}
                validate={getYesOrNoValidator()}
            />
            {harNattevåk === YesOrNo.YES && (
                <Box margin="xl">
                    <AppForm.Textarea
                        name={AppFormField.harNattevåk_ekstrainfo}
                        label={<FormattedMessage id="steg.nattevåk.tilleggsinfo.spm" />}
                        validate={getStringValidator({ required: true, maxLength: 1000 })}
                        maxLength={1000}
                        description={
                            <ExpandableInfo title={intlHelper(intl, 'steg.nattevåk.tilleggsinfo.veiledning.tittel')}>
                                <FormattedMessage id="steg.nattevåk.tilleggsinfo.veiledning" />
                            </ExpandableInfo>
                        }
                    />
                </Box>
            )}
        </FormikStep>
    );
};

export default NattevåkStep;
