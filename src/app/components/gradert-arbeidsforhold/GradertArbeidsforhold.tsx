import React from 'react';
import { FieldArray } from 'formik';
import { PleiepengesøknadFormData, Field } from 'app/types/PleiepengesøknadFormData';
import Input from '../input/Input';
import { validateNormaleArbeidstimer, validateReduserteArbeidstimer } from 'app/validation/fieldValidations';

interface GradertArbeidsforholdProps {}

const GradertArbeidsforhold: React.FunctionComponent<GradertArbeidsforholdProps> = (props) => (
    <FieldArray name={Field.ansettelsesforhold}>
        {({ name, form: { values } }) => {
            const { ansettelsesforhold } = values as PleiepengesøknadFormData;
            return (
                <div>
                    {ansettelsesforhold.map((forhold, idx) => (
                        <div key={`${forhold.organisasjonsnummer}${idx}`}>
                            <div>{forhold.navn}</div>
                            <Input
                                type="number"
                                min={0}
                                validate={(value) => validateNormaleArbeidstimer(value, true)}
                                name={`${name}.${idx}.normal_arbeidsuke` as Field}
                                label="Hvor mange timer arbeider du til vanlig?"
                                value={ansettelsesforhold[idx].normal_arbeidsuke || ''}
                            />
                            <Input
                                type="number"
                                min={0}
                                validate={(value) =>
                                    validateReduserteArbeidstimer(
                                        value,
                                        ansettelsesforhold[idx].normal_arbeidsuke,
                                        true
                                    )
                                }
                                name={`${name}.${idx}.redusert_arbeidsuke` as Field}
                                label="Hvor mange timer skal du nå jobbe?"
                                value={ansettelsesforhold[idx].redusert_arbeidsuke || ''}
                            />
                        </div>
                    ))}
                </div>
            );
        }}
    </FieldArray>
);

export default GradertArbeidsforhold;
