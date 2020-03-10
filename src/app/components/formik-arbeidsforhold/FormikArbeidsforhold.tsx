import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { FieldArray } from 'formik';
import FormikRadioPanelGroup from 'common/formik/components/formik-radio-panel-group/FormikRadioPanelGroup';
import FormikYesOrNoQuestion from 'common/formik/components/formik-yes-or-no-question/FormikYesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import intlHelper from 'common/utils/intlUtils';
import {
    validateRequiredField, validateYesOrNoIsAnswered
} from 'common/validation/fieldValidations';
import {
    AppFormField, Arbeidsforhold, ArbeidsforholdField, ArbeidsforholdSkalJobbeSvar
} from 'app/types/PleiepengesøknadFormData';
import RedusertArbeidsforholdPart from './RedusertArbeidsforholdPart';
import VetIkkeArbeidsforholdPart from './VetIkkeArbeidsforholdPart';

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
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                                    <FormBlock>
                                        <RedusertArbeidsforholdPart
                                            arbeidsforhold={arbeidsforhold}
                                            getFieldName={getFieldName}
                                        />
                                    </FormBlock>
                                )}
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke && (
                                    <FormBlock>
                                        <VetIkkeArbeidsforholdPart
                                            arbeidsforhold={arbeidsforhold}
                                            getFieldName={getFieldName}
                                        />
                                    </FormBlock>
                                )}
                            </>
                        )}
                    </>
                );
            }}
        </FieldArray>
    );
};

export default FormikArbeidsforhold;
