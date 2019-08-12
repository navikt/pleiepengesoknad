import React, { useState } from 'react';
import { SkjemaGruppe, Radio } from 'nav-frontend-skjema';
import Input from '../input/Input';
import intlHelper from 'app/utils/intlUtils';
import { Ansettelsesforhold } from 'app/types/Søkerdata';
import { Undertittel } from 'nav-frontend-typografi';
import { validateNormaleArbeidstimer, validateReduserteArbeidTimer } from 'app/validation/fieldValidations';
import { Field } from 'app/types/PleiepengesøknadFormData';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Box from '../box/Box';

interface ArbeidsforholdProps {
    name: Field;
    forhold: Ansettelsesforhold;
    index: number;
}

type ValueType = 'prosent' | 'timer' | undefined;

const Arbeidsforhold: React.FunctionComponent<ArbeidsforholdProps & InjectedIntlProps> = ({
    forhold,
    name,
    index,
    intl
}) => {
    const [valueType, setValueType] = useState<ValueType>(undefined);
    return (
        <>
            <Undertittel>{forhold.navn}</Undertittel>
            <Box margin="s">
                <Input
                    inputClassName="input--timer"
                    type="number"
                    min={0}
                    validate={(value: any) => validateNormaleArbeidstimer(value, true)}
                    name={`${name}.${index}.normal_arbeidsuke` as Field}
                    label={intlHelper(intl, 'gradertArbeidsforhold.timer_arbeidsuke', {
                        navn: forhold.navn
                    })}
                    value={forhold.normal_arbeidsuke || ''}
                />
                {forhold.normal_arbeidsuke && !isNaN(forhold.normal_arbeidsuke) && (
                    <SkjemaGruppe
                        className="timerEllerProsent"
                        title={intlHelper(intl, 'gradertArbeidsforhold.timer_redusert')}>
                        <Radio
                            name={`arbeidsforhold${forhold.organisasjonsnummer}`}
                            label="Prosent"
                            value="prosent"
                            onChange={(evt) => setValueType((evt.target as any).value as ValueType)}
                            checked={valueType === 'prosent'}
                        />
                        <Radio
                            name={`arbeidsforhold${forhold.organisasjonsnummer}`}
                            label="Timer"
                            value="timer"
                            onChange={(evt) => setValueType((evt.target as any).value as ValueType)}
                            checked={valueType === 'timer'}
                        />
                        {valueType === 'timer' && (
                            <Input
                                inputClassName="input--timer"
                                type="number"
                                min={0}
                                validate={(value: any) =>
                                    validateReduserteArbeidTimer(value, forhold.normal_arbeidsuke)
                                }
                                name={`${name}.${index}.redusert_arbeidsuke_timer` as Field}
                                label={intlHelper(intl, 'gradertArbeidsforhold.timerPerUkeLabel')}
                                value={forhold.redusert_arbeidsuke || ''}
                                className="input--timer"
                            />
                        )}
                        {valueType === 'prosent' && (
                            <Input
                                inputClassName="input--timer"
                                type="number"
                                min={0}
                                max={100}
                                validate={(value: any) =>
                                    validateReduserteArbeidTimer(value, forhold.normal_arbeidsuke)
                                }
                                name={`${name}.${index}.redusert_arbeidsuke_prosent` as Field}
                                label={intlHelper(intl, 'gradertArbeidsforhold.redusertProsentLabel', {
                                    timer: forhold.normal_arbeidsuke
                                })}
                                value={forhold.redusert_arbeidsuke || ''}
                                className="input--timer"
                            />
                        )}
                    </SkjemaGruppe>
                )}
            </Box>
        </>
    );
};

export default injectIntl(Arbeidsforhold);
