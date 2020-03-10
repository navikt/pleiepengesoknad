import * as React from 'react';
import { FormattedHTMLMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import FormikInputGroup from 'common/formik/components/formik-input-group/FormikInputGroup';
import FormikRadioPanelGroup from 'common/formik/components/formik-radio-panel-group/FormikRadioPanelGroup';
import FormikTextarea from 'common/formik/components/formik-textarea/FormikTextarea';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { validateYesOrNoIsAnswered } from 'common/validation/fieldValidations';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import {
    AppFormField, PleiepengesøknadFormData, TilsynVetIkkeHvorfor
} from '../../../types/PleiepengesøknadFormData';
import {
    validateSkalHaTilsynsordning, validateTilsynsordningTilleggsinfo
} from '../../../validation/fieldValidations';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';

const TilsynsordningStep: React.FunctionComponent<StepConfigProps> = ({ onValidSubmit }) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { tilsynsordning } = values;
    const { skalBarnHaTilsyn, vetIkke } = tilsynsordning || {};
    return (
        <FormikStep id={StepID.OMSORGSTILBUD} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                <FormattedHTMLMessage id="steg.tilsyn.veileder.html" />
            </CounsellorPanel>
            <Box margin="xl">
                <FormikYesOrNoQuestion
                    name={AppFormField.tilsynsordning__skalBarnHaTilsyn}
                    legend={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.spm')}
                    includeDoNotKnowOption={true}
                    validate={validateYesOrNoIsAnswered}
                />
            </Box>
            {YesOrNo.YES === skalBarnHaTilsyn && tilsynsordning && (
                <Box margin="xxl">
                    <FormikInputGroup<AppFormField>
                        legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.spm')}
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
                        radios={[
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.sporadisk'),
                                value: TilsynVetIkkeHvorfor.er_sporadisk
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.ikkeLagetPlan'),
                                value: TilsynVetIkkeHvorfor.er_ikke_laget_en_plan
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.annet'),
                                value: TilsynVetIkkeHvorfor.annet
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
