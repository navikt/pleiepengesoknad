import React from 'react';
import { FieldArray } from 'formik';
import { PleiepengesøknadFormData, Field } from 'app/types/PleiepengesøknadFormData';
import Input from '../input/Input';
import { validateNormaleArbeidstimer, validateReduserteArbeidTimer } from 'app/validation/fieldValidations';
import { Undertittel } from 'nav-frontend-typografi';
import Box from '../box/Box';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import intlHelper from 'app/utils/intlUtils';

import './gradertArbeidsforhold.less';

const GradertArbeidsforhold: React.FunctionComponent<InjectedIntlProps> = ({ intl }) => (
    <FieldArray name={Field.ansettelsesforhold}>
        {({ name, form: { values } }) => {
            const { ansettelsesforhold } = values as PleiepengesøknadFormData;
            return (
                <div className="gradert-arbeidsforhold">
                    {ansettelsesforhold.map((forhold, idx) => (
                        <Box key={`${forhold.organisasjonsnummer}${idx}`} margin="xl">
                            <Undertittel>{forhold.navn}</Undertittel>
                            <Box margin="s">
                                <Input
                                    inputClassName="input--timer"
                                    type="number"
                                    min={0}
                                    validate={(value) => validateNormaleArbeidstimer(value, true)}
                                    name={`${name}.${idx}.normal_arbeidsuke` as Field}
                                    label={intlHelper(intl, 'gradertArbeidsforhold.timer_arbeidsuke', {
                                        navn: forhold.navn
                                    })}
                                    value={ansettelsesforhold[idx].normal_arbeidsuke || ''}
                                />
                                <SkjemaGruppe
                                    className="timerEllerProsent"
                                    title={intlHelper(intl, 'gradertArbeidsforhold.timer_redusert')}>
                                    <Input
                                        inputClassName="input--timer"
                                        type="number"
                                        min={0}
                                        validate={(value) =>
                                            validateReduserteArbeidTimer(
                                                value,
                                                ansettelsesforhold[idx].normal_arbeidsuke
                                            )
                                        }
                                        name={`${name}.${idx}.redusert_arbeidsuke_timer` as Field}
                                        label={intlHelper(intl, 'gradertArbeidsforhold.timerPerUkeLabel')}
                                        value={ansettelsesforhold[idx].redusert_arbeidsuke || ''}
                                        className="input--timer"
                                    />
                                </SkjemaGruppe>
                            </Box>
                        </Box>
                    ))}
                </div>
            );
        }}
    </FieldArray>
);

export default injectIntl(GradertArbeidsforhold);
