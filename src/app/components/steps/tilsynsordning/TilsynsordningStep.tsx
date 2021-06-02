import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getRequiredFieldValidator, getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import {
    AppFormField,
    OmsorgstilbudVetPeriode,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import OmsorgstilbudFormPart from './OmsorgstilbudFormPart';
import { Undertittel } from 'nav-frontend-typografi';

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

    const periodeFra = datepickerUtils.getDateFromDateString(values.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(values.periodeTil);

    if (!periodeFra || !periodeTil) {
        return <div>Perioden mangler, gå tilbake og endre datoer</div>;
    }

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
                        {(ja?.hvorMyeTid === OmsorgstilbudVetPeriode.vetHelePerioden ||
                            (ja?.hvorMyeTid === OmsorgstilbudVetPeriode.usikker &&
                                ja?.vetMinAntallTimer === YesOrNo.YES)) && (
                            <>
                                <FormBlock>
                                    <AppForm.YesOrNoQuestion
                                        legend="Skal barnet være i et omsorgstilbud i like mange timer per dag hver uke gjennom hele søknadsperioden?"
                                        name={AppFormField.omsorgstilbud__ja_erLiktHverDag}
                                    />
                                </FormBlock>
                                {ja.erLiktHverDag === YesOrNo.YES && (
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
                                )}
                                {ja.erLiktHverDag === YesOrNo.NO && (
                                    <FormBlock margin="xxl">
                                        <Undertittel>Omsorgstilbud i perioden du søker for - detaljert</Undertittel>
                                        <p>Oppgi hver enkeltdag barnet skal i et omsorgstilbud.</p>
                                        <OmsorgstilbudFormPart
                                            periodeFra={periodeFra}
                                            periodeTil={periodeTil}
                                            fieldName={AppFormField.omsorgstilbud__ja__perioder}
                                            omsorgstilbud={values.omsorgstilbud?.ja?.perioder || []}
                                        />
                                    </FormBlock>
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
