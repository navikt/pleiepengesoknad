import React from 'react';
import { FieldArray } from 'formik';
import { PleiepengesøknadFormData, Field } from 'app/types/PleiepengesøknadFormData';
import { Ansettelsesforhold } from 'app/types/Søkerdata';
import AnsettelsesforholdDetaljer from './AnsettelsesforholdDetaljer';

import './gradertAnsettelsesforhold.less';

interface Props {
    organisasjonsnummer: string;
}

const GradertAnsettelsesforhold: React.FunctionComponent<Props> = ({ organisasjonsnummer }) => (
    <FieldArray name={Field.ansettelsesforhold}>
        {({ name, form: { values } }) => {
            const idx: number = (values as PleiepengesøknadFormData).ansettelsesforhold.findIndex(
                (a) => a.organisasjonsnummer === organisasjonsnummer
            );
            if (idx < 0) {
                return null;
            }
            const forhold: Ansettelsesforhold = values.ansettelsesforhold[idx];
            return (
                <div className="gradert-ansettelsesforhold">
                    <AnsettelsesforholdDetaljer forhold={forhold} formiInputNamePrefix={`${name}.${idx}.`} />
                </div>
            );
        }}
    </FieldArray>
);

export default GradertAnsettelsesforhold;
