import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useFormikContext } from 'formik';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import { AppFormField, PleiepengesøknadFormData, TilsynVetIkkeHvorfor } from '../../../types/PleiepengesøknadFormData';
import { validateSkalHaTilsynsordning } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FormikStep from '../../formik-step/FormikStep';
import Tilsynsuke from '../../tilsynsuke/Tilsynsuke';
import {
    getRequiredFieldValidator,
    getStringValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';

const TilsynsordningStep = ({ onValidSubmit }: StepConfigProps) => {
    const intl = useIntl();
    const { values } = useFormikContext<PleiepengesøknadFormData>();
    const { tilsynsordning } = values;
    const { skalBarnHaTilsyn, vetIkke } = tilsynsordning || {};
    return (
        <FormikStep id={StepID.OMSORGSTILBUD} onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel>
                <FormattedMessage id="steg.tilsyn.veileder.html" values={{ p: (msg: string) => <p>{msg}</p> }} />
            </CounsellorPanel>
            <Box margin="xl">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.tilsynsordning__skalBarnHaTilsyn}
                    legend={intlHelper(intl, 'steg.tilsyn.skalBarnetHaTilsyn.spm')}
                    includeDoNotKnowOption={true}
                    labels={{ doNotKnow: intlHelper(intl, 'VetIkke') }}
                    validate={getYesOrNoValidator()}
                />
            </Box>
            {YesOrNo.YES === skalBarnHaTilsyn && tilsynsordning && (
                <Box margin="xxl">
                    <AppForm.InputGroup
                        legend={intlHelper(intl, 'steg.tilsyn.ja.hvorMyeTilsyn.spm')}
                        validate={() => validateSkalHaTilsynsordning(tilsynsordning)}
                        name={'tilsynsordning_gruppe' as any}>
                        <Tilsynsuke name={AppFormField.tilsynsordning__ja__tilsyn} />
                    </AppForm.InputGroup>
                    <Box margin="xl">
                        <AppForm.Textarea
                            name={AppFormField.tilsynsordning__ja__ekstrainfo}
                            label={intlHelper(intl, 'steg.tilsyn.ja.tilleggsopplysninger.spm')}
                            validate={getStringValidator({ maxLength: 1000 })}
                            maxLength={1000}
                        />
                    </Box>
                </Box>
            )}
            {YesOrNo.DO_NOT_KNOW === skalBarnHaTilsyn && (
                <Box margin="xxl">
                    <AppForm.RadioPanelGroup
                        legend={intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.spm')}
                        name={AppFormField.tilsynsordning__vetIkke__hvorfor}
                        radios={[
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.sporadisk'),
                                value: TilsynVetIkkeHvorfor.erSporadisk,
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.ikkeLagetPlan'),
                                value: TilsynVetIkkeHvorfor.erIkkeLagetEnPlan,
                            },
                            {
                                label: intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.annet'),
                                value: TilsynVetIkkeHvorfor.annet,
                            },
                        ]}
                        validate={getRequiredFieldValidator()}
                    />
                    {vetIkke && vetIkke.hvorfor === TilsynVetIkkeHvorfor.annet && (
                        <Box margin="xl">
                            <AppForm.Textarea
                                name={AppFormField.tilsynsordning__vetIkke__ekstrainfo}
                                label={intlHelper(intl, 'steg.tilsyn.vetIkke.årsak.annet.tilleggsopplysninger')}
                                maxLength={1000}
                                validate={getStringValidator({ required: true, maxLength: 1000 })}
                            />
                        </Box>
                    )}
                </Box>
            )}
        </FormikStep>
    );
};

export default TilsynsordningStep;
