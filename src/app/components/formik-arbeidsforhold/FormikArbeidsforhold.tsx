import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import {
    FormikInput, FormikRadioPanelGroup, FormikYesOrNoQuestion
} from '@navikt/sif-common-formik/lib';
import { FieldArray } from 'formik';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import {
    validateRequiredField, validateYesOrNoIsAnswered
} from 'common/validation/fieldValidations';
import {
    AppFormField, Arbeidsforhold, ArbeidsforholdField, ArbeidsforholdSkalJobbeSvar
} from 'app/types/PleiepengesøknadFormData';
import { validateReduserteArbeidProsent } from '../../validation/fieldValidations';
import RedusertArbeidsforholdPart from './RedusertArbeidsforholdPart';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    index: number;
}

const FormikArbeidsforhold: React.FunctionComponent<Props> = ({ arbeidsforhold, index }) => {
    const intl = useIntl();
    return (
        <FieldArray name={AppFormField.arbeidsforhold}>
            {({ name }) => {
                const getFieldName = (field: ArbeidsforholdField) => `${name}.${index}.${field}` as AppFormField;
                return (
                    <Box padBottom="l">
                        <FormikYesOrNoQuestion<AppFormField>
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.erAnsattIPerioden)}
                            validate={validateYesOrNoIsAnswered}
                        />
                        {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                            <>
                                <FormBlock>
                                    <FormikRadioPanelGroup<AppFormField>
                                        legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm')}
                                        name={getFieldName(ArbeidsforholdField.skalJobbe)}
                                        validate={validateRequiredField}
                                        radios={[
                                            {
                                                label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                                                value: ArbeidsforholdSkalJobbeSvar.nei
                                            },
                                            {
                                                label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                                                value: ArbeidsforholdSkalJobbeSvar.vetIkke
                                            },
                                            {
                                                label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                                                value: ArbeidsforholdSkalJobbeSvar.ja
                                            },
                                            {
                                                label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.redusert'),
                                                value: ArbeidsforholdSkalJobbeSvar.redusert
                                            }
                                        ]}
                                    />
                                </FormBlock>
                                {arbeidsforhold.skalJobbe && (
                                    <FormBlock>
                                        <SkjemaGruppe
                                            legend={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                                                arbeidsforhold: arbeidsforhold.navn
                                            })}>
                                            <FormikInput<AppFormField>
                                                name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                                                type="number"
                                                label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
                                                inputClassName="input--timer"
                                                validate={(value) => validateReduserteArbeidProsent(value, true)}
                                                value={arbeidsforhold.jobberNormaltTimer || ''}
                                                min={0}
                                                max={100}
                                                maxLength={2}
                                            />
                                        </SkjemaGruppe>
                                    </FormBlock>
                                )}
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                                    <RedusertArbeidsforholdPart
                                        arbeidsforhold={arbeidsforhold}
                                        getFieldName={getFieldName}
                                    />
                                )}
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                                    <FormBlock>
                                        <RedusertArbeidsforholdPart
                                            arbeidsforhold={arbeidsforhold}
                                            getFieldName={getFieldName}
                                        />
                                    </FormBlock>
                                )}
                            </>
                        )}
                    </Box>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
