import React from 'react';
import { FieldArray } from 'formik';
import {
    AppFormField,
    Arbeidsforhold,
    ArbeidsforholdSkalJobbeSvar,
    ArbeidsforholdField
} from 'app/types/PleiepengesøknadFormData';
import Box from 'common/components/box/Box';
import { validateRequiredField } from 'app/validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';
import RedusertArbeidsforholdPart from './RedusertArbeidsforholdPart';
import VetIkkeArbeidsforholdPart from './VetIkkeArbeidsforholdPart';
import YesOrNoQuestion from '../../../common/components/yes-or-no-question/YesOrNoQuestion';
import { YesOrNo } from 'common/types/YesOrNo';
import { useIntl } from 'react-intl';
import FormikRadioPanelGroup from '../../../common/formik/formik-radio-panel-group/FormikRadioPanelGroup';

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
                        <YesOrNoQuestion
                            legend={intlHelper(intl, 'arbeidsforhold.erAnsattIPerioden.spm')}
                            name={getFieldName(ArbeidsforholdField.erAnsattIPerioden)}
                            validate={validateRequiredField}
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
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.redusert && (
                                    <RedusertArbeidsforholdPart
                                        arbeidsforhold={arbeidsforhold}
                                        getFieldName={getFieldName}
                                    />
                                )}
                                {arbeidsforhold.skalJobbe === ArbeidsforholdSkalJobbeSvar.vetIkke && (
                                    <VetIkkeArbeidsforholdPart
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
