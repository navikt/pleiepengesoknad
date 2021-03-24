import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredField,
    validateRequiredList,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import VirksomhetListAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetListAndDialog';
import Panel from 'nav-frontend-paneler';
import {
    AppFormField,
    ArbeidsforholdSNFField,
    Arbeidsform,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ArbeidsformInfoSNFrilanser from '../../formik-arbeidsforhold/ArbeidsformInfoSNFrilanser';
import { validateNumberInputValue } from '../../../validation/fieldValidations';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../../config/minMaxValues';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart = ({ formValues }: Props) => {
    const intl = useIntl();
    const { selvstendig_arbeidsforhold } = formValues;
    const getFieldName = (field: ArbeidsforholdSNFField) => {
        return `${AppFormField.selvstendig_arbeidsforhold}.${field}` as AppFormField;
    };
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.selvstendig_harHattInntektSomSN}
                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                    validate={validateYesOrNoIsAnswered}
                />
            </Box>
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <Box margin="l">
                    <Panel>
                        <VirksomhetListAndDialog
                            name={AppFormField.selvstendig_virksomheter}
                            labels={{
                                listTitle: intlHelper(intl, 'selvstendig.list.tittel'),
                                addLabel: intlHelper(intl, 'selvstendig.list.leggTilLabel'),
                                modalTitle: intlHelper(intl, 'selvstendig.dialog.tittel'),
                            }}
                            hideFormFields={{ harRevisor: true }}
                            validate={validateRequiredList}
                        />
                    </Panel>
                    {formValues.selvstendig_virksomheter && formValues.selvstendig_virksomheter.length > 0 && (
                        <Box margin="l">
                            <AppForm.YesOrNoQuestion
                                name={AppFormField.selvstendig_harLagtInnAlleSelskap}
                                legend={intlHelper(intl, 'selvstendig.harLagtInnAlleSelskap.spm')}
                                validate={validateYesOrNoIsAnswered}
                            />
                            {formValues.selvstendig_harLagtInnAlleSelskap === YesOrNo.NO && (
                                <Box margin="m">
                                    <AlertStripeAdvarsel>
                                        <FormattedMessage
                                            id={`selvstendig.harLagtInnAlleSelskap.alertStripeAdvarsel`}
                                        />
                                    </AlertStripeAdvarsel>
                                </Box>
                            )}
                            {formValues.selvstendig_harLagtInnAlleSelskap === YesOrNo.YES && (
                                <Box margin="l">
                                    <Panel>
                                        <FormBlock margin="none">
                                            <AppForm.RadioPanelGroup
                                                legend={intlHelper(intl, 'selvstendig.arbeidsforhold.spm')}
                                                name={getFieldName(ArbeidsforholdSNFField.arbeidsform)}
                                                radios={[
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            'frilanser.arbeidsforhold.arbeidsform.fast'
                                                        ),
                                                        value: Arbeidsform.fast,
                                                    },
                                                    {
                                                        label: intlHelper(
                                                            intl,
                                                            'frilanser.arbeidsforhold.arbeidsform.varierende'
                                                        ),
                                                        value: Arbeidsform.varierende,
                                                    },
                                                ]}
                                                validate={validateRequiredField}
                                            />
                                        </FormBlock>
                                        {selvstendig_arbeidsforhold?.arbeidsform !== undefined && (
                                            <Box margin="xl">
                                                <AppForm.NumberInput
                                                    name={getFieldName(ArbeidsforholdSNFField.jobberNormaltTimer)}
                                                    suffix={intlHelper(
                                                        intl,
                                                        `frilanser.arbeidsforhold.arbeidsform.${selvstendig_arbeidsforhold.arbeidsform}.timer.suffix`
                                                    )}
                                                    suffixStyle="text"
                                                    description={
                                                        <div style={{ width: '100%' }}>
                                                            <Box margin="none" padBottom="m">
                                                                {selvstendig_arbeidsforhold.arbeidsform ===
                                                                    Arbeidsform.fast && (
                                                                    <Box margin="m">
                                                                        <ArbeidsformInfoSNFrilanser
                                                                            arbeidsform={Arbeidsform.fast}
                                                                        />
                                                                    </Box>
                                                                )}

                                                                {selvstendig_arbeidsforhold.arbeidsform ===
                                                                    Arbeidsform.varierende && (
                                                                    <>
                                                                        <Box margin="m">
                                                                            <ArbeidsformInfoSNFrilanser
                                                                                arbeidsform={Arbeidsform.varierende}
                                                                            />
                                                                        </Box>
                                                                    </>
                                                                )}
                                                            </Box>
                                                        </div>
                                                    }
                                                    bredde="XS"
                                                    label={intlHelper(
                                                        intl,
                                                        `frilanser.arbeidsforhold.iDag.${selvstendig_arbeidsforhold.arbeidsform}.spm`
                                                    )}
                                                    validate={(value: any) => {
                                                        return validateNumberInputValue({
                                                            min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                            max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                        })(value);
                                                    }}
                                                    value={selvstendig_arbeidsforhold.arbeidsform || ''}
                                                />
                                            </Box>
                                        )}
                                    </Panel>
                                </Box>
                            )}
                        </Box>
                    )}
                </Box>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
