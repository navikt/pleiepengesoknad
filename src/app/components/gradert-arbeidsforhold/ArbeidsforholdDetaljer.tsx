import React from 'react';
import Input from '../input/Input';
import intlHelper from 'app/utils/intlUtils';
import { Ansettelsesforhold } from 'app/types/Søkerdata';
import {
    validateNormaleArbeidstimer,
    validateReduserteArbeidTimer,
    validateReduserteArbeidProsent,
    validateRequiredField
} from 'app/validation/fieldValidations';
import { Field } from 'app/types/PleiepengesøknadFormData';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import Box from '../box/Box';
import Panel from '../panel/Panel';
import YesOrNoQuestion from '../yes-or-no-question/YesOrNoQuestion';
import { YesOrNo } from 'app/types/YesOrNo';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';

interface ArbeidsforholdDetaljerProps {
    formiInputNamePrefix: string;
    forhold: Ansettelsesforhold;
}

const calculateReductionPercent = (forhold: Ansettelsesforhold): number | undefined => {
    const { normal_arbeidsuke, redusert_arbeidsuke } = forhold;
    if (normal_arbeidsuke !== undefined && redusert_arbeidsuke !== undefined) {
        return (100 / normal_arbeidsuke) * redusert_arbeidsuke;
    }
    return undefined;
};

const getReductionPercentValues = (forhold: Ansettelsesforhold): { pst: number } | undefined => {
    const pst = calculateReductionPercent(forhold);
    return pst !== undefined
        ? {
              pst
          }
        : undefined;
};

const ArbeidsforholdDetaljer: React.FunctionComponent<ArbeidsforholdDetaljerProps & InjectedIntlProps> = ({
    forhold,
    formiInputNamePrefix,
    intl
}) => {
    const getInputName = (input: string): Field => `${formiInputNamePrefix}${input}` as Field;

    return (
        <Box padBottom="m">
            <Panel border={true}>
                <Input
                    inputClassName="input--timer"
                    type="number"
                    min={0}
                    validate={(value: any) => validateNormaleArbeidstimer(value, true)}
                    name={getInputName('normal_arbeidsuke')}
                    label={intlHelper(intl, 'gradertArbeidsforhold.timer_arbeidsuke', {
                        navn: forhold.navn
                    })}
                    value={forhold.normal_arbeidsuke || ''}
                />
                {forhold.normal_arbeidsuke && !isNaN(forhold.normal_arbeidsuke) && (
                    <Box margin="l">
                        <YesOrNoQuestion
                            name={getInputName('skalArbeide')}
                            validate={validateRequiredField}
                            legend="Skal du jobbe noe her, i denne perioden?"
                        />
                    </Box>
                )}
                {forhold.skalArbeide === YesOrNo.YES && (
                    <Box margin="s">
                        <div className="timerEllerProsent">
                            <RadioPanelGroup
                                name={getInputName('pstEllerTimer')}
                                legend={intlHelper(intl, 'gradertArbeidsforhold.timer_redusert')}
                                radios={[
                                    {
                                        value: 'timer',
                                        label: 'Timer'
                                    },
                                    {
                                        value: 'prosent',
                                        label: 'Prosent'
                                    }
                                ]}
                            />
                            {forhold.pstEllerTimer === 'timer' && (
                                <Input
                                    inputClassName="input--timer"
                                    type="number"
                                    min={0}
                                    validate={(value: any) =>
                                        validateReduserteArbeidTimer(value, forhold.normal_arbeidsuke, true)
                                    }
                                    name={getInputName('redusert_arbeidsuke')}
                                    label={intlHelper(
                                        intl,
                                        forhold.redusert_arbeidsuke
                                            ? 'gradertArbeidsforhold.timerPerUkeLabel'
                                            : 'gradertArbeidsforhold.timerPerUkeLabel_utenVerdi',
                                        getReductionPercentValues(forhold)
                                    )}
                                    value={forhold.redusert_arbeidsuke || ''}
                                    className="input--timer"
                                />
                            )}
                            {forhold.pstEllerTimer === 'prosent' && (
                                <Input
                                    inputClassName="input--timer"
                                    type="number"
                                    min={0}
                                    max={100}
                                    validate={(value: any) => validateReduserteArbeidProsent(value, true)}
                                    name={getInputName('redusert_arbeidsuke')}
                                    label={intlHelper(intl, 'gradertArbeidsforhold.redusertProsentLabel', {
                                        timer: forhold.normal_arbeidsuke
                                    })}
                                    value={forhold.redusert_arbeidsuke || ''}
                                    className="input--timer"
                                />
                            )}
                        </div>
                    </Box>
                )}
            </Panel>
        </Box>
    );
};

export default injectIntl(ArbeidsforholdDetaljer);
