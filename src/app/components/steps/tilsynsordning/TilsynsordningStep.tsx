import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import datepickerUtils, {
    ISOStringToDate,
} from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import { getYesOrNoValidator } from '@navikt/sif-common-formik/lib/validation';
import { useFormikContext } from 'formik';
import AlertStripe from 'nav-frontend-alertstriper';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import OmsorgstilbudFormPart from './OmsorgstilbudFormPart';
import { skalSpørreOmOmsorgstilbudPerMåned } from '../../../utils/omsorgstilbudUtils';

export const cleanupTilsynsordningStep = (
    values: PleiepengesøknadFormData,
    spørOmMånedForOmsorgstilbud: boolean
): PleiepengesøknadFormData => {
    const v = { ...values };

    if (v.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (v.omsorgstilbud.ja?.vetHvorMyeTid === YesOrNo.YES) {
            v.omsorgstilbud.ja.vetNoeTid = YesOrNo.UNANSWERED;
        }
        if (v.omsorgstilbud.ja?.vetHvorMyeTid === YesOrNo.NO) {
            if (v.omsorgstilbud.ja?.vetNoeTid === YesOrNo.NO) {
                v.omsorgstilbud.ja.erLiktHverDag = YesOrNo.UNANSWERED;
                v.omsorgstilbud.ja.fasteDager = undefined;
                v.omsorgstilbud.ja.måneder = undefined;
            }
        }
        if (v.omsorgstilbud.ja?.erLiktHverDag === YesOrNo.YES) {
            v.omsorgstilbud.ja.måneder = undefined;
            v.omsorgstilbud.ja.enkeltdager = undefined;
        }
        if (v.omsorgstilbud.ja?.erLiktHverDag === YesOrNo.NO) {
            v.omsorgstilbud.ja.fasteDager = undefined;
        }
        const { enkeltdager } = v.omsorgstilbud.ja || {};

        if (enkeltdager && spørOmMånedForOmsorgstilbud) {
            Object.keys(enkeltdager).map((key) => {
                const dato = ISOStringToDate(key);
                console.log(dato);
                return enkeltdager[key];
            });
        }
    }
    if (v.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.NO) {
        v.omsorgstilbud.ja = undefined;
    }

    return v;
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

    const spørOmMånedForOmsorgstilbud =
        skalSpørreOmOmsorgstilbudPerMåned({ from: periodeFra, to: periodeTil }) === false;

    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupTilsynsordningStep(values, spørOmMånedForOmsorgstilbud)}
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
                    <AppForm.YesOrNoQuestion
                        legend={intlHelper(intl, 'steg.tilsyn.ja.årsak.spm')}
                        name={AppFormField.omsorgstilbud__ja__vetHvorMyeTid}
                        labels={{
                            yes: intlHelper(intl, 'steg.tilsyn.ja.årsak.vetHelePerioden'),
                            no: intlHelper(intl, 'steg.tilsyn.ja.årsak.usikkerPerioden'),
                        }}
                        validate={getYesOrNoValidator()}
                    />
                    <Box>
                        {ja?.vetHvorMyeTid === YesOrNo.NO && (
                            <>
                                <Box margin="xl">
                                    <AppForm.YesOrNoQuestion
                                        name={AppFormField.omsorgstilbud__ja__vetNoeTid}
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

                                {ja.vetNoeTid === YesOrNo.YES && (
                                    <>
                                        <Box margin="xl">
                                            <AlertStripe type={'info'}>
                                                <FormattedMessage id="steg.tilsyn.ja.hvorMyeTilsyn.alertInfo.ja" />
                                            </AlertStripe>
                                        </Box>
                                    </>
                                )}
                                {ja.vetNoeTid === YesOrNo.NO && (
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
                        {(ja?.vetHvorMyeTid === YesOrNo.YES ||
                            (ja?.vetHvorMyeTid === YesOrNo.NO && ja?.vetNoeTid === YesOrNo.YES)) && (
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
                                        <OmsorgstilbudFormPart
                                            info={ja}
                                            spørOmMånedForOmsorgstilbud={spørOmMånedForOmsorgstilbud}
                                            søknadsperiode={{ from: periodeFra, to: periodeTil }}
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
