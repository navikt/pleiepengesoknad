import React from 'react';
import { FieldArray } from 'formik';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
    AppFormField,
    AnsettelsesforholdForm,
    AnsettelsesforholdSkalJobbeSvar,
    AnsettelsesforholdField
} from 'app/types/PleiepengesøknadFormData';
import Box from 'common/components/box/Box';
import { validateRequiredField } from 'app/validation/fieldValidations';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import intlHelper from 'common/utils/intlUtils';
import RedusertAnsettelsesforholdPart from './RedusertAnsettelsesforholdPart';
import VetIkkeAnsettelsesforholdPart from './VetIkkeAnsettelsesforholdPart';
import YesOrNoQuestion from '../yes-or-no-question/YesOrNoQuestion';

import './ansettelsesforhold.less';
import { YesOrNo } from 'common/types/YesOrNo';

interface Props {
    ansettelsesforhold: AnsettelsesforholdForm;
    index: number;
}

const GradertAnsettelsesforhold: React.FunctionComponent<Props & InjectedIntlProps> = ({
    ansettelsesforhold,
    index,
    intl
}) => (
    <FieldArray name={AppFormField.ansettelsesforhold}>
        {({ name }) => {
            const getFieldName = (field: AnsettelsesforholdField) => `${name}.${index}.${field}` as AppFormField;
            return (
                <div className="ansettelsesforhold">
                    <YesOrNoQuestion
                        legend={intlHelper(intl, 'gradertAnsettelsesforhold.erAnsattIPerioden.spm')}
                        name={getFieldName(AnsettelsesforholdField.erAnsattIPerioden)}
                        validate={validateRequiredField}
                    />
                    {ansettelsesforhold.erAnsattIPerioden === YesOrNo.YES && (
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
                    )}
                </div>
            );
        }}
    </FieldArray>
);

export default injectIntl(GradertAnsettelsesforhold);
