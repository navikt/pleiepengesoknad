import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getStringValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { SøknadFormField, SøknadFormData } from '../../../types/SøknadFormData';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '../../../pre-common/form-section/FormSection';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { getSøkerKunHistoriskPeriode } from '../../../utils/tidsbrukUtils';

const cleanupNattevåkStep = (values: SøknadFormData): SøknadFormData => {
    const cleanedValues = { ...values };
    if (values.harNattevåk === YesOrNo.NO) {
        cleanedValues.harNattevåk_ekstrainfo = undefined;
    }
    return cleanedValues;
};

interface Props {
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const NattevåkOgBeredskapStep = ({ onValidSubmit, søknadsperiode, søknadsdato }: StepConfigProps & Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<SøknadFormData>();
    const { harNattevåk, harBeredskap } = values;

    const søkerKunHistoriskPeriode = getSøkerKunHistoriskPeriode(søknadsperiode, søknadsdato);

    return (
        <FormikStep
            id={StepID.NATTEVÅK_OG_BEREDSKAP}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={cleanupNattevåkStep}>
            <Box padBottom="l">
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <FormattedMessage
                        id={
                            søkerKunHistoriskPeriode
                                ? 'steg.nattevåkOgBeredskap.veileder.historisk'
                                : 'steg.nattevåkOgBeredskap.veileder'
                        }
                    />
                </CounsellorPanel>
            </Box>
            <FormSection title="Nattevåk">
                <FormattedMessage id={'steg.nattevåkOgBeredskap.nattevåk.veileder'} tagName="p" />

                <FormBlock>
                    <AppForm.YesOrNoQuestion
                        legend={intlHelper(
                            intl,
                            søkerKunHistoriskPeriode
                                ? 'steg.nattevåkOgBeredskap.nattevåk.historisk.spm'
                                : 'steg.nattevåkOgBeredskap.nattevåk.spm'
                        )}
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
                        <AppForm.Textarea
                            name={SøknadFormField.harNattevåk_ekstrainfo}
                            label={
                                <FormattedMessage
                                    id={
                                        søkerKunHistoriskPeriode
                                            ? 'steg.nattevåkOgBeredskap.nattevåk.historisk.tilleggsinfo.spm'
                                            : 'steg.nattevåkOgBeredskap.nattevåk.tilleggsinfo.spm'
                                    }
                                />
                            }
                            validate={getStringValidator({ required: true, maxLength: 1000 })}
                            maxLength={1000}
                            description={
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        søkerKunHistoriskPeriode
                                            ? 'steg.nattevåkOgBeredskap.nattevåk.historisk.tilleggsinfo.veiledning.tittel'
                                            : 'steg.nattevåkOgBeredskap.nattevåk.tilleggsinfo.veiledning.tittel'
                                    )}>
                                    <FormattedMessage
                                        id={
                                            søkerKunHistoriskPeriode
                                                ? 'steg.nattevåkOgBeredskap.nattevåk.historisk.tilleggsinfo.veiledning'
                                                : 'steg.nattevåkOgBeredskap.nattevåk.tilleggsinfo.veiledning'
                                        }
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
                    <AppForm.YesOrNoQuestion
                        legend={intlHelper(
                            intl,
                            søkerKunHistoriskPeriode
                                ? 'steg.nattevåkOgBeredskap.beredskap.historisk.spm'
                                : 'steg.nattevåkOgBeredskap.beredskap.spm'
                        )}
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
                        <AppForm.Textarea
                            name={SøknadFormField.harBeredskap_ekstrainfo}
                            label={
                                <FormattedMessage
                                    id={
                                        søkerKunHistoriskPeriode
                                            ? 'steg.nattevåkOgBeredskap.beredskap.historisk.tilleggsinfo.spm'
                                            : 'steg.nattevåkOgBeredskap.beredskap.tilleggsinfo.spm'
                                    }
                                />
                            }
                            maxLength={1000}
                            validate={getStringValidator({ required: true, maxLength: 1000 })}
                            description={
                                <ExpandableInfo
                                    title={intlHelper(
                                        intl,
                                        søkerKunHistoriskPeriode
                                            ? 'steg.nattevåkOgBeredskap.beredskap.historisk.tilleggsinfo.veiledning.tittel'
                                            : 'steg.nattevåkOgBeredskap.beredskap.tilleggsinfo.veiledning.tittel'
                                    )}>
                                    <FormattedMessage
                                        id={
                                            søkerKunHistoriskPeriode
                                                ? 'steg.nattevåkOgBeredskap.beredskap.historisk.tilleggsinfo.veiledning'
                                                : 'steg.nattevåkOgBeredskap.beredskap.tilleggsinfo.veiledning'
                                        }
                                    />
                                </ExpandableInfo>
                            }
                        />
                    </FormBlock>
                )}
            </FormSection>
        </FormikStep>
    );
};

export default NattevåkOgBeredskapStep;
