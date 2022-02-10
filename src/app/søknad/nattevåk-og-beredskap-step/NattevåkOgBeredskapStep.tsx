import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '@navikt/sif-common-core/lib/components/form-section/FormSection';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getStringValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import useEffectOnce from '../../hooks/useEffectOnce';
import usePersistOnChange from '../../hooks/usePersistOnChange';
import { SøknadFormData, SøknadFormField } from '../../types/SøknadFormData';
import SøknadFormComponents from '../SøknadFormComponents';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';

const cleanupStep = (values: SøknadFormData): SøknadFormData => {
    const cleanedValues = { ...values };
    if (values.harNattevåk === YesOrNo.NO) {
        cleanedValues.harNattevåk_ekstrainfo = undefined;
    }
    if (values.harBeredskap === YesOrNo.NO) {
        cleanedValues.harBeredskap_ekstrainfo = undefined;
    }
    return cleanedValues;
};

const NattevåkOgBeredskapStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const [loaded, setLoaded] = useState<boolean>(false);

    const { values } = useFormikContext<SøknadFormData>();
    const { harNattevåk, harNattevåk_ekstrainfo, harBeredskap, harBeredskap_ekstrainfo } = values;

    usePersistOnChange(harNattevåk_ekstrainfo, loaded, StepID.NATTEVÅK_OG_BEREDSKAP);
    usePersistOnChange(harBeredskap_ekstrainfo, loaded, StepID.NATTEVÅK_OG_BEREDSKAP);

    useEffectOnce(() => {
        setLoaded(true);
    });

    return (
        <SøknadFormStep id={StepID.NATTEVÅK_OG_BEREDSKAP} onValidFormSubmit={onValidSubmit} onStepCleanup={cleanupStep}>
            <Box padBottom="xl">
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <FormattedMessage id={'steg.nattevåkOgBeredskap.veileder'} />
                </CounsellorPanel>
            </Box>
            <FormSection title="Nattevåk">
                <FormattedMessage id={'steg.nattevåkOgBeredskap.nattevåk.veileder'} tagName="p" />

                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.nattevåkOgBeredskap.nattevåk.spm')}
                        name={SøknadFormField.harNattevåk}
                        description={
                            <ExpandableInfo
                                title={intlHelper(
                                    intl,
                                    'steg.nattevåkOgBeredskap.nattevåk.spm.description.flereBarn.tittel'
                                )}>
                                <FormattedMessage id={'steg.nattevåkOgBeredskap.nattevåk.spm.description.flereBarn'} />
                            </ExpandableInfo>
                        }
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>

                {harNattevåk === YesOrNo.YES && (
                    <FormBlock>
                        <SøknadFormComponents.Textarea
                            name={SøknadFormField.harNattevåk_ekstrainfo}
                            label={<FormattedMessage id={'steg.nattevåkOgBeredskap.nattevåk.tilleggsinfo.spm'} />}
                            validate={getStringValidator({ required: true, maxLength: 1000 })}
                            maxLength={1000}
                            description={
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        'steg.nattevåkOgBeredskap.nattevåk.tilleggsinfo.veiledning.tittel'
                                    )}>
                                    <FormattedMessage
                                        id={'steg.nattevåkOgBeredskap.nattevåk.tilleggsinfo.veiledning'}
                                    />
                                </ExpandableInfo>
                            }
                        />
                    </FormBlock>
                )}
            </FormSection>
            <FormSection title="Beredskap">
                <FormattedMessage id={'steg.nattevåkOgBeredskap.beredskap.veileder'} tagName="p" />
                <FormBlock>
                    <SøknadFormComponents.YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.nattevåkOgBeredskap.beredskap.spm')}
                        name={SøknadFormField.harBeredskap}
                        description={
                            <ExpandableInfo
                                title={intlHelper(
                                    intl,
                                    'steg.nattevåkOgBeredskap.beredskap.spm.description.flereBarn.tittel'
                                )}>
                                <FormattedMessage id={'steg.nattevåkOgBeredskap.beredskap.spm.description.flereBarn'} />
                            </ExpandableInfo>
                        }
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
                {harBeredskap === YesOrNo.YES && (
                    <FormBlock>
                        <SøknadFormComponents.Textarea
                            name={SøknadFormField.harBeredskap_ekstrainfo}
                            label={<FormattedMessage id={'steg.nattevåkOgBeredskap.beredskap.tilleggsinfo.spm'} />}
                            maxLength={1000}
                            validate={getStringValidator({ required: true, maxLength: 1000 })}
                            description={
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        'steg.nattevåkOgBeredskap.beredskap.tilleggsinfo.veiledning.tittel'
                                    )}>
                                    <FormattedMessage
                                        id={'steg.nattevåkOgBeredskap.beredskap.tilleggsinfo.veiledning'}
                                    />
                                </ExpandableInfo>
                            }
                        />
                    </FormBlock>
                )}
            </FormSection>
        </SøknadFormStep>
    );
};

export default NattevåkOgBeredskapStep;
