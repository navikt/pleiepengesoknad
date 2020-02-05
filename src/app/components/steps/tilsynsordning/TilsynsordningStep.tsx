import * as React from 'react';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { useIntl, FormattedHTMLMessage } from 'react-intl';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { AppFormField, TilsynVetIkkeHvorfor } from '../../../types/PleiepengesøknadFormData';
import Box from 'common/components/box/Box';
import { YesOrNo } from 'common/types/YesOrNo';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import {
    validateSkalHaTilsynsordning,
    validateYesOrNoIsAnswered,
    validateTilsynsordningTilleggsinfo
} from '../../../validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import { getNextStepRoute } from '../../../utils/routeUtils';
import FormikInputGroup from 'common/formik/formik-input-group/FormikInputGroup';
import FormikTextarea from 'common/formik/formik-textarea/FormikTextarea';
import FormikRadioPanelGroup from 'common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { persistAndNavigateTo } from 'app/utils/navigationUtils';

type Props = CommonStepFormikProps & HistoryProps & StepConfigProps;

const TilsynsordningStep: React.FunctionComponent<Props> = ({ history, formValues, ...stepProps }) => {
    const nextStepRoute = getNextStepRoute(StepID.OMSORGSTILBUD, formValues);
    const intl = useIntl();
    const { tilsynsordning } = formValues;
    const { skalBarnHaTilsyn, vetIkke } = tilsynsordning || {};
    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onValidFormSubmit={() => persistAndNavigateTo(history, StepID.OMSORGSTILBUD, formValues, nextStepRoute)}
            history={history}
            {...stepProps}
            formValues={formValues}>
            <CounsellorPanel>
                <FormattedHTMLMessage id="steg.tilsyn.veileder.html" />
            </CounsellorPanel>
            <Box margin="xl">
                <FormikYesOrNoQuestion
                    name={AppFormField.tilsynsordning__skalBarnHaTilsyn}
                    legend={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.spm')}
                    includeDoNotKnowOption={true}
                    validate={validateYesOrNoIsAnswered}
                    singleColumn={true}
                />
            </Box>
            {YesOrNo.YES === skalBarnHaTilsyn && tilsynsordning && (
                <Box margin="xxl">
                    <FormikInputGroup<AppFormField>
                        label={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.spm')}
                        validate={validateSkalHaTilsynsordning}
                        name={AppFormField.tilsynsordning}>
                        <Tilsynsuke name={AppFormField.tilsynsordning__ja__tilsyn} />
                    </FormikInputGroup>
                    <Box margin="xl">
                        <FormikTextarea<AppFormField>
                            name={AppFormField.tilsynsordning__ja__ekstrainfo}
                            label={intlHelper(intl, 'steg.tilsyn.ja.tilleggsopplysninger.spm')}
                            validate={validateTilsynsordningTilleggsinfo}
                            maxLength={1000}
                        />
                    </Box>
                </Box>
            )}
            {YesOrNo.DO_NOT_KNOW === skalBarnHaTilsyn && (
                <Box margin="xxl">
                    <FormikRadioPanelGroup<AppFormField>
                        legend={intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.spm')}
                        name={AppFormField.tilsynsordning__vetIkke__hvorfor}
                        singleColumn={true}
                        radios={[
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.sporadisk'),
                                value: TilsynVetIkkeHvorfor.er_sporadisk,
                                key: TilsynVetIkkeHvorfor.er_sporadisk
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.ikkeLagetPlan'),
                                value: TilsynVetIkkeHvorfor.er_ikke_laget_en_plan,
                                key: TilsynVetIkkeHvorfor.er_ikke_laget_en_plan
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.annet'),
                                value: TilsynVetIkkeHvorfor.annet,
                                key: TilsynVetIkkeHvorfor.annet
                            }
                        ]}
                    />
                    {vetIkke && vetIkke.hvorfor === TilsynVetIkkeHvorfor.annet && (
                        <Box margin="xl">
                            <FormikTextarea<AppFormField>
                                name={AppFormField.tilsynsordning__vetIkke__ekstrainfo}
                                label={intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.annet.tilleggsopplysninger')}
                                maxLength={1000}
                                validate={validateTilsynsordningTilleggsinfo}
                            />
                        </Box>
                    )}
                </Box>
            )}
        </FormikStep>
    );
};

export default TilsynsordningStep;
