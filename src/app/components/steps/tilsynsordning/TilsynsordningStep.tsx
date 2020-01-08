import * as React from 'react';
import { navigateTo } from '../../../utils/navigationUtils';
import { StepID, StepConfigProps } from '../../../config/stepConfig';
import { HistoryProps } from 'common/types/History';
import FormikStep from '../../formik-step/FormikStep';
import { InjectedIntlProps, injectIntl, FormattedHTMLMessage } from 'react-intl';
import { AppFormField, TilsynVetIkkeHvorfor } from '../../../types/PleiepengesøknadFormData';
import YesOrNoQuestion from '../../yes-or-no-question/YesOrNoQuestion';
import Box from 'common/components/box/Box';
import { YesOrNo } from 'common/types/YesOrNo';
import Textarea from '../../textarea/Textarea';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import InputGroup from '../../input-group/InputGroup';
import {
    validateSkalHaTilsynsordning,
    validateYesOrNoIsAnswered,
    validateTilsynsordningTilleggsinfo
} from '../../../validation/fieldValidations';
import RadioPanelGroup from '../../radio-panel-group/RadioPanelGroup';
import intlHelper from 'common/utils/intlUtils';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import { CommonStepFormikProps } from '../../pleiepengesøknad-content/PleiepengesøknadContent';
import { getNextStepRoute } from '../../../utils/routeUtils';

type Props = CommonStepFormikProps & HistoryProps & InjectedIntlProps & StepConfigProps;

const TilsynsordningStep: React.FunctionComponent<Props> = ({ history, intl, formValues, ...stepProps }) => {
    const nextStepRoute = getNextStepRoute(StepID.OMSORGSTILBUD, formValues);
    const navigate = nextStepRoute ? () => navigateTo(nextStepRoute, history) : undefined;
    const { tilsynsordning } = formValues;
    const { skalBarnHaTilsyn, vetIkke } = tilsynsordning || {};
    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onValidFormSubmit={navigate}
            history={history}
            {...stepProps}
            formValues={formValues}>
            <CounsellorPanel>
                <FormattedHTMLMessage id="steg.tilsyn.veileder.html" />
            </CounsellorPanel>
            <Box margin="xl">
                <YesOrNoQuestion
                    name={AppFormField.tilsynsordning__skalBarnHaTilsyn}
                    legend={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.spm')}
                    includeDoNotKnowOption={true}
                    validate={validateYesOrNoIsAnswered}
                    singleColumn={true}
                />
            </Box>
            {YesOrNo.YES === skalBarnHaTilsyn && tilsynsordning && (
                <Box margin="xxl">
                    <InputGroup
                        label={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.spm')}
                        validate={validateSkalHaTilsynsordning}
                        name={AppFormField.tilsynsordning}>
                        <Tilsynsuke name={AppFormField.tilsynsordning__ja__tilsyn} />
                    </InputGroup>
                    <Box margin="xl">
                        <Textarea
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
                    <RadioPanelGroup
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
                            <Textarea
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

export default injectIntl(TilsynsordningStep);
