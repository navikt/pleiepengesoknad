import React from 'react';
import { FieldArray } from 'formik';
import { PleiepengesøknadFormData, Field } from 'app/types/PleiepengesøknadFormData';
import Input from '../input/Input';
import { validateNormaleArbeidstimer, validateReduserteArbeidstimer } from 'app/validation/fieldValidations';
import { Ansettelsesforhold } from 'app/types/Søkerdata';

interface GradertArbeidsforholdProps {
    organisasjonsnummer: string;
}

const GradertArbeidsforhold: React.FunctionComponent<GradertArbeidsforholdProps> = ({ organisasjonsnummer }) => (
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
                <div>
                    <div key={`${forhold.organisasjonsnummer}${idx}`}>
                        <div>{forhold.navn}</div>
                        <Input
                            type="number"
                            min={0}
                            validate={(value) => validateNormaleArbeidstimer(value, true)}
                            name={`${name}.${idx}.normal_arbeidsuke` as Field}
                            label="Hvor mange timer arbeider du til vanlig?"
                            value={forhold.normal_arbeidsuke || ''}
                        />
                        <Input
                            type="number"
                            min={0}
                            validate={(value) => validateReduserteArbeidstimer(value, forhold.normal_arbeidsuke, true)}
                            name={`${name}.${idx}.redusert_arbeidsuke` as Field}
                            label="Hvor mange timer skal du nå jobbe?"
                            value={forhold.redusert_arbeidsuke || ''}
                        />
                    </div>
                </div>
            );
        }}
    </FieldArray>
);

export default GradertArbeidsforhold;
