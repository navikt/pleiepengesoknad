import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getNumberValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';
import VirksomhetInfoAndDialog from '@navikt/sif-common-forms/lib/virksomhet/VirksomhetInfoAndDialog';
import Panel from 'nav-frontend-paneler';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../../config/minMaxValues';
import {
    AppFormField,
    ArbeidsforholdSNFField,
    Arbeidsform,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import AppForm from '../../app-form/AppForm';
import ArbeidsformInfoSNFrilanser from '../../formik-arbeidsforhold/ArbeidsformInfoSNFrilanser';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { isYesOrNoAnswered } from '../../../validation/fieldValidations';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../lenker';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const SelvstendigNæringsdrivendeFormPart = ({ formValues }: Props) => {
    const intl = useIntl();
    const { selvstendig_arbeidsforhold, selvstendig_virksomhet, selvstendig_harFlereVirksomheter } = formValues;
    const getFieldName = (field: ArbeidsforholdSNFField) => {
        return `${AppFormField.selvstendig_arbeidsforhold}.${field}` as AppFormField;
    };
    const harFlereVirksomheter = selvstendig_harFlereVirksomheter === YesOrNo.YES;
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.selvstendig_harHattInntektSomSN}
                    legend={intlHelper(intl, 'selvstendig.harDuHattInntekt.spm')}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'selvstendig.harDuHattInntekt.hjelpetekst.tittel')}>
                            <>
                                {intlHelper(intl, 'selvstendig.harDuHattInntekt.hjelpetekst')}{' '}
                                <Lenke href={getLenker(intl.locale).skatteetatenSN} target="_blank">
                                    <FormattedMessage id="selvstendig.harDuHattInntekt.hjelpetekst.snSkatteetatenLenke" />
                                </Lenke>
                            </>
                        </ExpandableInfo>
                    }
                />
            </Box>
            {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES && (
                <>
                    <FormBlock>
                        <AppForm.YesOrNoQuestion
                            name={AppFormField.selvstendig_harFlereVirksomheter}
                            legend={intlHelper(intl, 'selvstendig.harFlereVirksomheter.spm')}
                            validate={getYesOrNoValidator()}
                        />
                    </FormBlock>

                    {harFlereVirksomheter && (
                        <FormBlock>
                            <CounsellorPanel>
                                <FormattedMessage id="selvstendig.veileder.flereAktiveVirksomheter" />
                            </CounsellorPanel>
                        </FormBlock>
                    )}

                    {formValues.selvstendig_harHattInntektSomSN === YesOrNo.YES &&
                        selvstendig_harFlereVirksomheter &&
                        isYesOrNoAnswered(selvstendig_harFlereVirksomheter) && (
                            <Box margin="l">
                                <Panel>
                                    <VirksomhetInfoAndDialog
                                        name={AppFormField.selvstendig_virksomhet}
                                        harFlereVirksomheter={harFlereVirksomheter}
                                        labels={{
                                            infoTitle: selvstendig_virksomhet
                                                ? intlHelper(intl, 'selvstendig.infoDialog.infoTittel')
                                                : undefined,
                                            editLabel: intlHelper(intl, 'selvstendig.infoDialog.endreKnapp'),
                                            deleteLabel: intlHelper(intl, 'selvstendig.infoDialog.fjernKnapp'),
                                            addLabel: intlHelper(intl, 'selvstendig.infoDialog.registrerKnapp'),
                                            modalTitle: harFlereVirksomheter
                                                ? intlHelper(intl, 'selvstendig.infoDialog.tittel.flere')
                                                : intlHelper(intl, 'selvstendig.infoDialog.tittel.en'),
                                        }}
                                        validate={getRequiredFieldValidator()}
                                    />
                                </Panel>
                                {formValues.selvstendig_virksomhet && (
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
                                                                'snFrilanser.arbeidsforhold.arbeidsform.fast'
                                                            ),
                                                            value: Arbeidsform.fast,
                                                        },
                                                        {
                                                            label: intlHelper(
                                                                intl,
                                                                'snFrilanser.arbeidsforhold.arbeidsform.turnus'
                                                            ),
                                                            value: Arbeidsform.turnus,
                                                        },
                                                        {
                                                            label: intlHelper(
                                                                intl,
                                                                'snFrilanser.arbeidsforhold.arbeidsform.varierende'
                                                            ),
                                                            value: Arbeidsform.varierende,
                                                        },
                                                    ]}
                                                    validate={getRequiredFieldValidator()}
                                                />
                                            </FormBlock>
                                            {selvstendig_arbeidsforhold?.arbeidsform !== undefined && (
                                                <Box margin="xl">
                                                    <AppForm.NumberInput
                                                        name={getFieldName(ArbeidsforholdSNFField.jobberNormaltTimer)}
                                                        suffix={intlHelper(
                                                            intl,
                                                            `snFrilanser.arbeidsforhold.arbeidsform.${selvstendig_arbeidsforhold.arbeidsform}.timer.suffix`
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
                                                                        Arbeidsform.turnus && (
                                                                        <>
                                                                            <Box margin="m">
                                                                                <ArbeidsformInfoSNFrilanser
                                                                                    arbeidsform={Arbeidsform.turnus}
                                                                                />
                                                                            </Box>
                                                                        </>
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
                                                            `snFrilanser.arbeidsforhold.iDag.${selvstendig_arbeidsforhold.arbeidsform}.spm`
                                                        )}
                                                        validate={(value) => {
                                                            const error = getNumberValidator({
                                                                required: true,
                                                                min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                                max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                            })(value);
                                                            if (error) {
                                                                return {
                                                                    key: `validation.selvstendig_arbeidsforhold.jobberNormaltTimer.${selvstendig_arbeidsforhold.arbeidsform}.${error}`,
                                                                    values: {
                                                                        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                                        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                                    },
                                                                    keepKeyUnaltered: true,
                                                                };
                                                            }
                                                            return error;
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
                </>
            )}
        </>
    );
};

export default SelvstendigNæringsdrivendeFormPart;
