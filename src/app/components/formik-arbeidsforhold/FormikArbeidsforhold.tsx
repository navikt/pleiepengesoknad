import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    validateRequiredField,
    validateRequiredNumber,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { SkjemagruppeQuestion } from '@navikt/sif-common-formik';
import { FieldArray } from 'formik';
import { MAX_TIMER_NORMAL_ARBEIDSFORHOLD, MIN_TIMER_NORMAL_ARBEIDSFORHOLD } from '../../config/minMaxValues';
import { AppFormField, Arbeidsforhold, ArbeidsforholdField, Arbeidsform } from '../../types/PleiepengesøknadFormData';
import AppForm from '../app-form/AppForm';
import './timerInput.less';

// import RedusertArbeidsforholdPart from './RedusertArbeidsforholdPart';

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
                    <Box padBottom="l">
                        <AppForm.YesOrNoQuestion
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.erAnsattIPerioden)}
                            validate={validateYesOrNoIsAnswered}
                        />
                        {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                            <>
                                <FormBlock>
                                    <AppForm.RadioPanelGroup
                                        legend="Hvordan jobber du?"
                                        name={getFieldName(ArbeidsforholdField.arbeidsform)}
                                        radios={[
                                            {
                                                label: 'Fast',
                                                value: Arbeidsform.fast,
                                            },
                                            {
                                                label: 'Turnus',
                                                value: Arbeidsform.turnus,
                                            },
                                            {
                                                label: 'Deltid/varierende/tilkalling',
                                                value: Arbeidsform.varierende,
                                            },
                                        ]}
                                        validate={validateRequiredField}
                                    />
                                </FormBlock>
                                {arbeidsforhold.arbeidsform !== undefined && (
                                    <Box margin="xl">
                                        <SkjemagruppeQuestion
                                            legend={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                                                arbeidsforhold: arbeidsforhold.navn,
                                            })}>
                                            <AppForm.Input
                                                name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                                                description={
                                                    <Box margin="none" padBottom="m">
                                                        {arbeidsforhold.arbeidsform === Arbeidsform.fast && (
                                                            <>
                                                                Sed ut perspiciatis unde omnis iste natus error sit
                                                                voluptatem accusantium doloremque laudantium, totam rem
                                                                aperiam, eaque ipsa quae ab illo inventore veritatis et
                                                                quasi arc
                                                            </>
                                                        )}
                                                        {arbeidsforhold.arbeidsform === Arbeidsform.turnus && (
                                                            <>
                                                                Accusantium doloremque laudantium, totam rem aperiam,
                                                                eaque ipsa quae ab illo inventore veritatis et quasi arc
                                                                Sed ut perspiciatis unde omnis iste natus error sit
                                                                voluptatem accusantium doloremque laudantium, totam rem
                                                                aperiam, eaque ipsa quae ab illo inventore veritatis et
                                                                quasi arc
                                                            </>
                                                        )}
                                                        {arbeidsforhold.arbeidsform === Arbeidsform.varierende && (
                                                            <>
                                                                eaque ipsa quae ab illo inventore veritatis et quasi arc
                                                                <p>
                                                                    Sed ut perspiciatis unde omnis iste natus error sit
                                                                    voluptatem accusantium doloremque laudantium, totam
                                                                    rem aperiam, eaque ipsa quae ab illo inventore
                                                                    veritatis et quasi arc
                                                                </p>
                                                            </>
                                                        )}
                                                    </Box>
                                                }
                                                type="number"
                                                className={'skjemaelement--timer-input'}
                                                label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
                                                validate={(value) =>
                                                    validateRequiredNumber({
                                                        min: MIN_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                        max: MAX_TIMER_NORMAL_ARBEIDSFORHOLD,
                                                    })(value)
                                                }
                                                value={arbeidsforhold.jobberNormaltTimer || ''}
                                                min={MIN_TIMER_NORMAL_ARBEIDSFORHOLD}
                                                max={MAX_TIMER_NORMAL_ARBEIDSFORHOLD}
                                            />
                                        </SkjemagruppeQuestion>
                                    </Box>
                                )}
                            </>
                        )}
                        {/* {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                            <FormBlock>
                                <AppForm.RadioPanelGroup
                                    legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm')}
                                    name={getFieldName(ArbeidsforholdField.skalJobbe)}
                                    validate={validateRequiredField}
                                    radios={[
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                                            value: ArbeidsforholdSkalJobbeSvar.nei,
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                                            value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                                            value: ArbeidsforholdSkalJobbeSvar.ja,
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.redusert'),
                                            value: ArbeidsforholdSkalJobbeSvar.redusert,
                                        },
                                    ]}
                                />
                                {arbeidsforhold.skalJobbe && <></>}
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                                    <RedusertArbeidsforholdPart
                                        arbeidsforhold={arbeidsforhold}
                                        getFieldName={getFieldName}
                                    />
                                )}
                            </FormBlock>
                        )} */}
                    </Box>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
