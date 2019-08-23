import React from 'react';
import { FieldArray } from 'formik';
import { PleiepengesøknadFormData, Field, AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';

import './gradertAnsettelsesforhold.less';
import Box from '../box/Box';
import Panel from '../panel/Panel';
import Input from '../input/Input';
import { validateReduserteArbeidProsent } from 'app/validation/fieldValidations';
import intlHelper from 'app/utils/intlUtils';
import { injectIntl, InjectedIntlProps } from 'react-intl';

interface Props {
    organisasjonsnummer: string;
}

const GradertAnsettelsesforhold: React.FunctionComponent<Props & InjectedIntlProps> = ({
    organisasjonsnummer,
    intl
}) => (
    <FieldArray name={Field.ansettelsesforhold}>
        {({ name, form: { values } }) => {
            const idx: number = (values as PleiepengesøknadFormData).ansettelsesforhold.findIndex(
                (a) => a.organisasjonsnummer === organisasjonsnummer
            );
            if (idx < 0) {
                return null;
            }
            const forhold: AnsettelsesforholdForm = values.ansettelsesforhold[idx];
            return (
                <div className="gradert-ansettelsesforhold">
                    <Box padBottom="m">
                        <Panel border={true}>
                            <Input
                                inputClassName="input--timer"
                                type="number"
                                min={0}
                                max={100}
                                validate={(value) => validateReduserteArbeidProsent(value, true)}
                                name={`${name}.${idx}.redusert_arbeidsprosent` as Field}
                                label={intlHelper(intl, 'gradertAnsettelsesforhold.timer_redusert')}
                                value={forhold.redusert_arbeidsprosent || ''}
                                className="input--timer"
                            />
                        </Panel>
                    </Box>
                </div>
            );
        }}
    </FieldArray>
);

export default injectIntl(GradertAnsettelsesforhold);
