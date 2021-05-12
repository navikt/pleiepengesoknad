import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getDateValidator,
    getNumberValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';
import Panel from 'nav-frontend-paneler';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../../config/minMaxValues';
import {
    AppFormField,
    ArbeidsforholdSNFField,
    Arbeidsform,
    PleiepengesøknadFormData,
} from '../../../types/PleiepengesøknadFormData';
import { validateFrilanserStartdato } from '../../../validation/fieldValidations';
import AppForm from '../../app-form/AppForm';
import ArbeidsformInfoSNFrilanser from '../../formik-arbeidsforhold/ArbeidsformInfoSNFrilanser';
import FrilansEksempeltHtml from './FrilansEksempelHtml';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';

interface Props {
    formValues: PleiepengesøknadFormData;
}

const FrilansFormPart = ({ formValues }: Props) => {
    const { frilans_jobberFortsattSomFrilans, harHattInntektSomFrilanser, frilans_arbeidsforhold, frilans_startdato } =
        formValues;

    const intl = useIntl();
    const getFieldName = (field: ArbeidsforholdSNFField) => {
        return `${AppFormField.frilans_arbeidsforhold}.${field}` as AppFormField;
    };
    return (
        <>
            <Box margin="l">
                <AppForm.YesOrNoQuestion
                    name={AppFormField.frilans_harHattInntektSomFrilanser}
                    legend={intlHelper(intl, 'frilanser.harDuHattInntekt.spm')}
                    validate={getYesOrNoValidator()}
                    description={
                        <ExpandableInfo title={intlHelper(intl, 'frilanser.hjelpetekst.spm')}>
                            <FrilansEksempeltHtml />
                        </ExpandableInfo>
                    }
                />
            </Box>
            {harHattInntektSomFrilanser === YesOrNo.YES && (
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
                                    validate={getYesOrNoValidator()}
                                />
                            </Box>
                            {frilans_jobberFortsattSomFrilans === YesOrNo.NO && (
                                <Box margin="xl">
                                    <AppForm.DatePicker
                                        name={AppFormField.frilans_sluttdato}
                                        label={intlHelper(intl, 'frilanser.nårSluttet.spm')}
                                        showYearSelector={true}
                                        minDate={datepickerUtils.getDateFromDateString(frilans_startdato)}
                                        maxDate={dateToday}
                                        validate={getDateValidator({
                                            required: true,
                                            min: datepickerUtils.getDateFromDateString(frilans_startdato),
                                            max: dateToday,
                                        })}
                                    />
                                </Box>
                            )}
                            {frilans_jobberFortsattSomFrilans === YesOrNo.YES && (
                                <Box margin="xl">
                                    <FormBlock margin="none">
                                        <AppForm.RadioPanelGroup
                                            legend={intlHelper(intl, 'frilanser.arbeidsforhold.arbeidsform.spm')}
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
                                    {frilans_arbeidsforhold?.arbeidsform !== undefined && (
                                        <Box margin="xl">
                                            <AppForm.NumberInput
                                                name={getFieldName(ArbeidsforholdSNFField.jobberNormaltTimer)}
                                                suffix={intlHelper(
                                                    intl,
                                                    `snFrilanser.arbeidsforhold.arbeidsform.${frilans_arbeidsforhold.arbeidsform}.timer.suffix`
                                                )}
                                                suffixStyle="text"
                                                description={
                                                    <div style={{ width: '100%' }}>
                                                        <Box margin="none" padBottom="m">
                                                            {frilans_arbeidsforhold.arbeidsform ===
                                                                Arbeidsform.fast && (
                                                                <Box margin="m">
                                                                    <ArbeidsformInfoSNFrilanser
                                                                        arbeidsform={Arbeidsform.fast}
                                                                    />
                                                                </Box>
                                                            )}
                                                            {frilans_arbeidsforhold.arbeidsform ===
                                                                Arbeidsform.turnus && (
                                                                <>
                                                                    <Box margin="m">
                                                                        <ArbeidsformInfoSNFrilanser
                                                                            arbeidsform={Arbeidsform.turnus}
                                                                        />
                                                                    </Box>
                                                                </>
                                                            )}
                                                            {frilans_arbeidsforhold.arbeidsform ===
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
                                                    `snFrilanser.arbeidsforhold.iDag.${frilans_arbeidsforhold.arbeidsform}.spm`
                                                )}
                                                validate={(value) => {
                                                    const error = getNumberValidator({
                                                        required: true,
                                                        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                    })(value);
                                                    if (error) {
                                                        return {
                                                            key: `validation.frilans_arbeidsforhold.jobberNormaltTimer.${frilans_arbeidsforhold.arbeidsform}.${error}`,
                                                            values: {
                                                                min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                                max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                            },
                                                            keepKeyUnaltered: true,
                                                        };
                                                    }
                                                    return error;
                                                }}
                                                value={frilans_arbeidsforhold.arbeidsform || ''}
                                            />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </Panel>
                    </Box>
                </>
            )}
        </>
    );
};

export default FrilansFormPart;
