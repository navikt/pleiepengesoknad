import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import {
    AppFormField,
    PleiepengesøknadFormData,
    OmsorgstilbudVetPeriode,
} from '../../../types/PleiepengesøknadFormData';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import AlertStripe from 'nav-frontend-alertstriper';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';

export const cleanupTilsynsordningStep = (values: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const cleanedValues = { ...values };

    if (cleanedValues.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (cleanedValues.omsorgstilbud.ja?.hvorMyeTid === OmsorgstilbudVetPeriode.vetHelePerioden) {
            cleanedValues.omsorgstilbud.ja.vetMinAntallTimer = undefined;
        }
        if (cleanedValues.omsorgstilbud.ja?.hvorMyeTid === OmsorgstilbudVetPeriode.usikker) {
            if (cleanedValues.omsorgstilbud.ja?.vetMinAntallTimer === YesOrNo.NO) {
                cleanedValues.omsorgstilbud.ja.fasteDager = undefined;
            }
        }
    }
    if (cleanedValues.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.NO) {
        cleanedValues.omsorgstilbud.ja = undefined;
    }

    return cleanedValues;
};

const TilsynsordningStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { omsorgstilbud } = values;
    const { skalBarnIOmsorgstilbud: skalBarnHaTilsyn, ja } = omsorgstilbud || {};

    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={cleanupTilsynsordningStep}
            onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                <FormattedMessage id="steg.tilsyn.veileder.html" values={{ p: (msg: string) => <p>{msg}</p> }} />
            </CounsellorPanel>
            <Box margin="xl">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.omsorgstilbud__skalBarnIOmsorgstilbud}
                    legend={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.spm')}
                    validate={getYesOrNoValidator()}
                />
            </Box>
            {YesOrNo.YES === skalBarnHaTilsyn && omsorgstilbud && (
                <Box margin="xxl">
                    <AppForm.RadioPanelGroup
                        legend={intlHelper(intl, 'steg.tilsyn.ja.årsak.spm')}
                        name={AppFormField.omsorgstilbud__ja__hvorMyeTid}
                        radios={[
                            {
                                label: intlHelper(intl, 'steg.tilsyn.ja.årsak.vetHelePerioden'),
                                value: OmsorgstilbudVetPeriode.vetHelePerioden,
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.ja.årsak.usikkerPerioden'),
                                value: OmsorgstilbudVetPeriode.usikker,
                            },
                        ]}
                        validate={getRequiredFieldValidator()}
                    />
                    <Box>
                        {ja?.hvorMyeTid === OmsorgstilbudVetPeriode.vetHelePerioden && (
                            <Box margin="xl">
                                <AppForm.InputGroup
                                    legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn')}
                                    validate={() => validateSkalHaTilsynsordning(omsorgstilbud)}
                                    description={
                                        <ExpandableInfo
                                            title={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.description.tittel')}>
                                            {intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.description')}
                                        </ExpandableInfo>
                                    }
                                    name={'tilsynsordning_gruppe' as any}>
                                    <Tilsynsuke name={AppFormField.omsorgstilbud__ja__fasteDager} />
                                </AppForm.InputGroup>
                            </Box>
                        )}
                        {ja?.hvorMyeTid === OmsorgstilbudVetPeriode.usikker && (
                            <>
                                <Box margin="xl">
                                    <AppForm.YesOrNoQuestion
                                        name={AppFormField.omsorgstilbud__ja__vetMinAntallTimer}
                                        legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.spm')}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(
                                                    intl,
                                                    'steg.tilsyn.ja.hvorMyeTilsyn.spm.description.tittel'
                                                )}>
                                                {
                                                    <FormattedHtmlMessage id="steg.tilsyn.ja.hvorMyeTilsyn.spm.description.html" />
                                                }
                                            </ExpandableInfo>
                                        }
                                        validate={getYesOrNoValidator()}
                                    />
                                </Box>

                                {ja.vetMinAntallTimer === YesOrNo.YES && (
                                    <>
                                        <Box margin="xl">
                                            <AlertStripe type={'info'}>
                                                <FormattedMessage id="steg.tilsyn.ja.hvorMyeTilsyn.alertInfo.ja" />
                                            </AlertStripe>
                                        </Box>
                                        <Box margin="xl">
                                            <AppForm.InputGroup
                                                legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn')}
                                                description={
                                                    <ExpandableInfo
                                                        title={intlHelper(
                                                            intl,
                                                            'steg.tilsyn.ja.hvorMyeTilsyn.description.tittel'
                                                        )}>
                                                        {intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.description')}
                                                    </ExpandableInfo>
                                                }
                                                validate={() => validateSkalHaTilsynsordning(omsorgstilbud)}
                                                name={'tilsynsordning_gruppe' as any}>
                                                <Tilsynsuke name={AppFormField.omsorgstilbud__ja__fasteDager} />
                                            </AppForm.InputGroup>
                                        </Box>
                                    </>
                                )}
                                {ja.vetMinAntallTimer === YesOrNo.NO && (
                                    <>
                                        <Box margin="l">
                                            <AlertStripe type={'info'}>
                                                <FormattedMessage id="steg.tilsyn.ja.hvorMyeTilsyn.alertInfo.nei" />
                                            </AlertStripe>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            )}
        </FormikStep>
    );
};

export default TilsynsordningStep;
