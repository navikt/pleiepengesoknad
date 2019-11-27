import React from 'react';
import { FieldArray } from 'formik';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
    PleiepengesøknadFormData,
    Field,
    AnsettelsesforholdForm,
    AnsettelsesforholdSkalJobbeSvar,
    AnsettelsesforholdField
} from 'app/types/PleiepengesøknadFormData';
import Box from '../box/Box';
import { validateRequiredField } from 'app/validation/fieldValidations';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import intlHelper from '../../utils/intlUtils';
import RedusertAnsettelsesforholdPart from './RedusertAnsettelsesforholdPart';

import './gradertAnsettelsesforhold.less';
import VetIkkeAnsettelsesforholdPart from './VetIkkeAnsettelsesforholdPart';

interface Props {
    organisasjonsnummer: string;
}

const GradertAnsettelsesforhold: React.FunctionComponent<Props & InjectedIntlProps> = ({
    organisasjonsnummer,
    intl
}) => (
    <FieldArray name={Field.ansettelsesforhold}>
        {({ name, form: { values } }) => {
            const index: number = (values as PleiepengesøknadFormData).ansettelsesforhold.findIndex(
                (forhold) => forhold.organisasjonsnummer === organisasjonsnummer
            );
            if (index < 0) {
                return null;
            }
            const ansettelsesforhold: AnsettelsesforholdForm = values.ansettelsesforhold[index];
            const getFieldName = (field: AnsettelsesforholdField) => `${name}.${index}.${field}` as Field;

            return (
                <div className="gradert-ansettelsesforhold">
                    <Box padBottom="m">
                        <RadioPanelGroup
                            legend={intlHelper(intl, 'gradertAnsettelsesforhold.arbeidsforhold.spm')}
                            singleColumn={true}
                            name={getFieldName(AnsettelsesforholdField.skalJobbe)}
                            validate={validateRequiredField}
                            radios={[
                                {
                                    label: intlHelper(intl, 'gradertAnsettelsesforhold.arbeidsforhold.nei'),
                                    value: AnsettelsesforholdSkalJobbeSvar.nei,
                                    key: AnsettelsesforholdSkalJobbeSvar.nei
                                },
                                {
                                    label: intlHelper(intl, 'gradertAnsettelsesforhold.arbeidsforhold.vetIkke'),
                                    value: AnsettelsesforholdSkalJobbeSvar.vetIkke,
                                    key: AnsettelsesforholdSkalJobbeSvar.vetIkke
                                },
                                {
                                    label: intlHelper(intl, 'gradertAnsettelsesforhold.arbeidsforhold.ja'),
                                    value: AnsettelsesforholdSkalJobbeSvar.ja,
                                    key: AnsettelsesforholdSkalJobbeSvar.ja
                                },
                                {
                                    label: intlHelper(intl, 'gradertAnsettelsesforhold.arbeidsforhold.redusert'),
                                    value: AnsettelsesforholdSkalJobbeSvar.redusert,
                                    key: AnsettelsesforholdSkalJobbeSvar.redusert
                                }
                            ]}
                        />
                        {ansettelsesforhold.skalJobbe === AnsettelsesforholdSkalJobbeSvar.redusert && (
                            <RedusertAnsettelsesforholdPart
                                ansettelsesforhold={ansettelsesforhold}
                                getFieldName={getFieldName}
                            />
                        )}
                        {ansettelsesforhold.skalJobbe === AnsettelsesforholdSkalJobbeSvar.vetIkke && (
                            <VetIkkeAnsettelsesforholdPart
                                ansettelsesforhold={ansettelsesforhold}
                                getFieldName={getFieldName}
                            />
                        )}
                    </Box>
                </div>
            );
        }}
    </FieldArray>
);

export default injectIntl(GradertAnsettelsesforhold);
