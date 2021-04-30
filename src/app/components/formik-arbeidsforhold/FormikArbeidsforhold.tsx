import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    getNumberValidator,
    getRequiredFieldValidator,
    getYesOrNoValidator,
} from '@navikt/sif-common-formik/lib/validation';
import { FieldArray } from 'formik';
import Panel from 'nav-frontend-paneler';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../config/minMaxValues';
import { AppFormField, Arbeidsforhold, ArbeidsforholdField, Arbeidsform } from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import ArbeidsformInfo from './arbeidsforholdInfo';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    index: number;
}

const FormikArbeidsforhold = ({ arbeidsforhold, index }: Props) => {
    const intl = useIntl();
    return (
        <FieldArray name={AppFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdField) => `${name}.${index}.${field}` as AppFormField;
                return (
                    <Box>
                        <AppForm.YesOrNoQuestion
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.erAnsattIPerioden)}
                            validate={(value) => {
                                return getYesOrNoValidator()(value)
                                    ? {
                                          key: 'validation.arbeidsforhold.erAnsattIPerioden.yesOrNoIsUnanswered',
                                          values: { navn: arbeidsforhold.navn },
                                          keepKeyUnaltered: true,
                                      }
                                    : undefined;
                            }}
                        />
                        {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                            <Box margin="l">
                                <Panel>
                                    <FormBlock margin="none">
                                        <AppForm.RadioPanelGroup
                                            legend={intlHelper(intl, 'arbeidsforhold.arbeidsform.spm', {
                                                arbeidsforhold: arbeidsforhold.navn,
                                            })}
                                            name={getFieldName(ArbeidsforholdField.arbeidsform)}
                                            radios={[
                                                {
                                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsform.fast'),
                                                    value: Arbeidsform.fast,
                                                },
                                                {
                                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsform.turnus'),
                                                    value: Arbeidsform.turnus,
                                                },
                                                {
                                                    label: intlHelper(intl, 'arbeidsforhold.arbeidsform.varierende'),
                                                    value: Arbeidsform.varierende,
                                                },
                                            ]}
                                            validate={(value) => {
                                                return getRequiredFieldValidator()(value)
                                                    ? {
                                                          key:
                                                              'validation.arbeidsforhold.arbeidsform.yesOrNoIsUnanswered',
                                                          values: { navn: arbeidsforhold.navn },
                                                          keepKeyUnaltered: true,
                                                      }
                                                    : undefined;
                                            }}
                                        />
                                    </FormBlock>
                                    {arbeidsforhold.arbeidsform !== undefined && (
                                        <Box margin="xl">
                                            <AppForm.NumberInput
                                                name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                                                suffix={intlHelper(
                                                    intl,
                                                    `arbeidsforhold.arbeidsform.${arbeidsforhold.arbeidsform}.timer.suffix`
                                                )}
                                                suffixStyle="text"
                                                description={
                                                    <div style={{ width: '100%' }}>
                                                        <Box margin="none" padBottom="m">
                                                            {arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                                                <Box margin="m">
                                                                    <ArbeidsformInfo arbeidsform={Arbeidsform.fast} />
                                                                </Box>
                                                            )}
                                                            {arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                                                <Box margin="m">
                                                                    <ArbeidsformInfo arbeidsform={Arbeidsform.turnus} />
                                                                </Box>
                                                            )}
                                                            {arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
                                                                <>
                                                                    <Box margin="m">
                                                                        <ArbeidsformInfo
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
                                                    `arbeidsforhold.iDag.${arbeidsforhold.arbeidsform}.spm`,
                                                    {
                                                        arbeidsforhold: arbeidsforhold.navn,
                                                    }
                                                )}
                                                validate={(value) => {
                                                    const error = getNumberValidator({
                                                        required: true,
                                                        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                    })(value);
                                                    if (error) {
                                                        return {
                                                            key: `validation.arbeidsforhold.jobberNormaltTimer.${arbeidsforhold.arbeidsform}.${error}`,
                                                            values: {
                                                                navn: arbeidsforhold.navn,
                                                                min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                                max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                            },
                                                            keepKeyUnaltered: true,
                                                        };
                                                    }
                                                    return error;
                                                }}
                                                value={arbeidsforhold.jobberNormaltTimer || ''}
                                            />
                                        </Box>
                                    )}
                                </Panel>
                            </Box>
                        )}
                    </Box>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
