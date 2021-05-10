import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData, TilsynVetPeriode } from '../../../types/PleiepengesøknadFormData';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import AlertStripe from 'nav-frontend-alertstriper';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

export const cleanupTilsynsordningStep = (values: PleiepengesøknadFormData): PleiepengesøknadFormData => {
    const cleanedValues = { ...values };

    if (cleanedValues.tilsynsordning?.skalBarnHaTilsyn === YesOrNo.YES) {
        if (cleanedValues.tilsynsordning.ja?.hvorMyeTid === TilsynVetPeriode.vetHelePerioden) {
            cleanedValues.tilsynsordning.ja.vetMinAntallTimer = undefined;
        }
        if (cleanedValues.tilsynsordning.ja?.hvorMyeTid === TilsynVetPeriode.usikker) {
            if (cleanedValues.tilsynsordning.ja?.vetMinAntallTimer === YesOrNo.NO) {
                cleanedValues.tilsynsordning.ja.tilsyn = undefined;
            }
        }
    }
    if (cleanedValues.tilsynsordning?.skalBarnHaTilsyn === YesOrNo.NO) {
        cleanedValues.tilsynsordning.ja = undefined;
    }

    return cleanedValues;
};

const TilsynsordningStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { tilsynsordning } = values;
    const { skalBarnHaTilsyn, ja } = tilsynsordning || {};

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
                    name={AppFormField.tilsynsordning__skalBarnHaTilsyn}
                    description={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.description')}
                    legend={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.spm')}
                    validate={getYesOrNoValidator()}
                />
            </Box>
            {YesOrNo.YES === skalBarnHaTilsyn && tilsynsordning && (
                <Box margin="xxl">
                    <AppForm.RadioPanelGroup
                        legend={intlHelper(intl, 'steg.tilsyn.ja.årsak.spm')}
                        name={AppFormField.tilsynsordning__ja__hvorMyeTid}
                        radios={[
                            {
                                label: intlHelper(intl, 'steg.tilsyn.ja.årsak.vetHelePerioden'),
                                value: TilsynVetPeriode.vetHelePerioden,
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.ja.årsak.usikkerPerioden'),
                                value: TilsynVetPeriode.usikker,
                            },
                        ]}
                        validate={getRequiredFieldValidator()}
                    />
                    <Box>
                        {ja?.hvorMyeTid === TilsynVetPeriode.vetHelePerioden && (
                            <Box margin="xl">
                                <AppForm.InputGroup
                                    legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn')}
                                    validate={() => validateSkalHaTilsynsordning(tilsynsordning)}
                                    description={
                                        <ExpandableInfo
                                            title={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.description.tittel')}>
                                            {intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.description')}
                                        </ExpandableInfo>
                                    }
                                    name={'tilsynsordning_gruppe' as any}>
                                    <Tilsynsuke name={AppFormField.tilsynsordning__ja__tilsyn} />
                                </AppForm.InputGroup>
                            </Box>
                        )}
                        {ja?.hvorMyeTid === TilsynVetPeriode.usikker && (
                            <>
                                <Box margin="xl">
                                    <AppForm.YesOrNoQuestion
                                        name={AppFormField.tilsynsordning__ja__vetMinAntallTimer}
                                        legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.spm')}
                                        description={
                                            <ExpandableInfo
                                                title={intlHelper(
                                                    intl,
                                                    'steg.tilsyn.ja.hvorMyeTilsyn.spm.description.tittel'
                                                )}>
                                                {intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.spm.description')}
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
                                                validate={() => validateSkalHaTilsynsordning(tilsynsordning)}
                                                name={'tilsynsordning_gruppe' as any}>
                                                <Tilsynsuke name={AppFormField.tilsynsordning__ja__tilsyn} />
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
