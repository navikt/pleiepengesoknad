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
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormSection from '../../../pre-common/form-section/FormSection';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

const cleanupNattevåkStep = (values: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const cleanedValues = { ...values };
    if (values.harNattevåk === YesOrNo.NO) {
        cleanedValues.harNattevåk_ekstrainfo = undefined;
    }
    return cleanedValues;
};

interface Props {
    periodeFørSøknadsdato?: DateRange;
    periodeFraOgMedSøknadsdato?: DateRange;
}

const NattevåkOgBeredskapStep = ({
    onValidSubmit,
    periodeFørSøknadsdato,
    periodeFraOgMedSøknadsdato,
}: StepConfigProps & Props) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { harNattevåk, harBeredskap } = values;

    const søkerKunHistoriskPeriode = periodeFørSøknadsdato !== undefined && periodeFraOgMedSøknadsdato === undefined;

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
                        name={AppFormField.harNattevåk}
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>

                {harNattevåk === YesOrNo.YES && (
                    <FormBlock>
                        <AppForm.Textarea
                            name={AppFormField.harNattevåk_ekstrainfo}
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
                        name={AppFormField.harBeredskap}
                        validate={getYesOrNoValidator()}
                    />
                </FormBlock>
                {harBeredskap === YesOrNo.YES && (
                    <FormBlock>
                        <AppForm.Textarea
                            name={AppFormField.harBeredskap_ekstrainfo}
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
