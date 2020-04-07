import React from 'react';
import { useIntl } from 'react-intl';
import { FieldArray } from 'formik';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import FormikInput from '@navikt/sif-common/lib/common/formik/formik-input/FormikInput';
import Box from 'common/components/box/Box';
import FormikRadioPanelGroup from 'common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import FormikYesOrNoQuestion from 'common/formik/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import { validateRequiredField } from 'common/validation/fieldValidations';
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
                    <>
                        <FormikYesOrNoQuestion
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.erAnsattIPerioden)}
                            isRequired={true}
                        />
                        {arbeidsforhold.erAnsattIPerioden === YesOrNo.YES && (
                            <Box padBottom="m">
                                <FormikRadioPanelGroup<AppFormField>
                                    legend={intlHelper(intl, 'arbeidsforhold.arbeidsforhold.spm')}
                                    singleColumn={true}
                                    name={getFieldName(ArbeidsforholdField.skalJobbe)}
                                    validate={validateRequiredField}
                                    radios={[
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.nei'),
                                            value: ArbeidsforholdSkalJobbeSvar.nei,
                                            key: ArbeidsforholdSkalJobbeSvar.nei
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.vetIkke'),
                                            value: ArbeidsforholdSkalJobbeSvar.vetIkke,
                                            key: ArbeidsforholdSkalJobbeSvar.vetIkke
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.ja'),
                                            value: ArbeidsforholdSkalJobbeSvar.ja,
                                            key: ArbeidsforholdSkalJobbeSvar.ja
                                        },
                                        {
                                            label: intlHelper(intl, 'arbeidsforhold.arbeidsforhold.redusert'),
                                            value: ArbeidsforholdSkalJobbeSvar.redusert,
                                            key: ArbeidsforholdSkalJobbeSvar.redusert
                                        }
                                    ]}
                                />
                                {arbeidsforhold.skalJobbe && (
                                    <>
                                        <Box margin="xl">
                                            <SkjemaGruppe
                                                title={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                                                    arbeidsforhold: arbeidsforhold.navn
                                                })}>
                                                <FormikInput<AppFormField>
                                                    name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                                                    type="number"
                                                    label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
                                                    inputClassName="input--timer"
                                                    validate={(value) => validateReduserteArbeidProsent(value, true)}
                                                    value={arbeidsforhold.jobberNormaltTimer || ''}
                                                    labelRight={true}
                                                    min={0}
                                                    max={100}
                                                    maxLength={2}
                                                />
                                            </SkjemaGruppe>
                                        </Box>
                                    </>
                                )}
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                                    <RedusertArbeidsforholdPart
                                        arbeidsforhold={arbeidsforhold}
                                        getFieldName={getFieldName}
                                    />
                                )}
                            </Box>
                        )}
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
