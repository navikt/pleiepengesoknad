import React from 'react';
import { FieldArray } from 'formik';
import { PleiepengesøknadFormData, Field } from 'app/types/PleiepengesøknadFormData';
import Box from '../box/Box';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import './gradertArbeidsforhold.less';
import Arbeidsforhold from './Arbeidsforhold';

const GradertArbeidsforhold: React.FunctionComponent<InjectedIntlProps> = ({ intl }) => (
    <FieldArray name={Field.ansettelsesforhold}>
        {({ name, form: { values } }) => {
            const { ansettelsesforhold } = values as PleiepengesøknadFormData;
            return (
                <div className="gradert-arbeidsforhold">
                    {ansettelsesforhold.map((forhold, idx) => (
                        <Box key={`${forhold.organisasjonsnummer}${idx}`} margin="xl">
                            <Arbeidsforhold forhold={forhold} index={idx} name={name as Field} />
                        </Box>
                    ))}
                </div>
            );
        }}
    </FieldArray>
);

export default injectIntl(GradertArbeidsforhold);
