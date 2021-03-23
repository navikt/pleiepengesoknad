import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredField,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import Panel from 'nav-frontend-paneler';
import {
    AppFormField,
    ArbeidsforholdFrilanserField,
    Arbeidsform,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import { validateFrilanserStartdato, validateNumberInputValue } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import FrilansEksempeltHtml from './FrilansEksempelHtml';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ArbeidsformInfoFrilanser from '../../../components/formik-arbeidsforhold/arbeidsFormInfoFrilanser';
import { MIN_TIMER_NORMAL_ARBEIDSFORHOLD, MAX_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../../config/minMaxValues';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart = ({ formValues }: Props) => {
    const harHattInntektSomFrilanser = formValues[AppFormField.frilans_harHattInntektSomFrilanser] === YesOrNo.YES;
    const jobberFortsattSomFrilans = formValues[AppFormField.frilans_jobberFortsattSomFrilans] === YesOrNo.YES;
    const { frilans_arbeidsforhold } = formValues;

    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdFrilanserField) => {
        return `${AppFormField.frilans_arbeidsforhold}.${field}` as AppFormField;
    };
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.frilans_harHattInntektSomFrilanser}
                    legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                    validate={validateYesOrNoIsAnswered}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                            <FrilansEksempeltHtml />
                        </ExpandableInfo>
                    }
                />
            </Box>
            {harHattInntektSomFrilanser && (
                <>
                    <Box margin="l">
                        <Panel>
                            <Box>
                                <AppForm.DatePicker
                                    name={AppFormField.frilans_startdato}
                                    label={intlHelper(intl, 'frilanser.nårStartet.spm')}
                                    showYearSelector={true}
                                    maxDate={dateToday}
                                    validate={validateFrilanserStartdato}
                                />
                            </Box>
                            <Box margin="xl">
                                <AppForm.YesOrNoQuestion
                                    name={AppFormField.frilans_jobberFortsattSomFrilans}
                                    legend={intlHelper(intl, 'frilanser.jobberFortsatt.spm')}
                                    validate={validateYesOrNoIsAnswered}
                                />
                            </Box>
                        </Panel>
                    </Box>
                    {jobberFortsattSomFrilans && (
                        <Box margin="l">
                            <Panel>
                                <FormBlock margin="none">
                                    <AppForm.RadioPanelGroup
                                        legend={intlHelper(intl, 'frilanser.arbeidsforhold.arbeidsform.spm')}
                                        name={getFieldName(ArbeidsforholdFrilanserField.arbeidsform)}
                                        radios={[
                                            {
                                                label: intlHelper(intl, 'frilanser.arbeidsforhold.arbeidsform.fast'),
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
                                {frilans_arbeidsforhold?.arbeidsform !== undefined && (
                                    <Box margin="xl">
                                        <AppForm.NumberInput
                                            name={getFieldName(ArbeidsforholdFrilanserField.jobberNormaltTimer)}
                                            suffix={intlHelper(
                                                intl,
                                                `frilanser.arbeidsforhold.arbeidsform.${frilans_arbeidsforhold.arbeidsform}.timer.suffix`
                                            )}
                                            suffixStyle="text"
                                            description={
                                                <div style={{ width: '100%' }}>
                                                    <Box margin="none" padBottom="m">
                                                        {frilans_arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                                            <Box margin="m">
                                                                <ArbeidsformInfoFrilanser
                                                                    arbeidsform={Arbeidsform.fast}
                                                                />
                                                            </Box>
                                                        )}

                                                        {frilans_arbeidsforhold.arbeidsform ===
                                                            Arbeidsform.varierende && (
                                                            <>
                                                                <Box margin="m">
                                                                    <ArbeidsformInfoFrilanser
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
                                                `frilanser.arbeidsforhold.iDag.${frilans_arbeidsforhold.arbeidsform}.spm`
                                            )}
                                            validate={(value: any) => {
                                                return validateNumberInputValue({
                                                    min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                    max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                })(value);
                                            }}
                                            value={frilans_arbeidsforhold.arbeidsform || ''}
                                        />
                                    </Box>
                                )}
                            </Panel>
                        </Box>
                    )}
                </>
            )}
        </>
    );
};

export default FrilansFormPart;
