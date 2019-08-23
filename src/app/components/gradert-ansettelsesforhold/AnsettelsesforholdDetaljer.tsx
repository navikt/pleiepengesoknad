import React from 'react';
import Input from '../input/Input';
import intlHelper from 'app/utils/intlUtils';
import { HoursOrPercent } from 'app/types/Søkerdata';
import {
    validateReduserteArbeidTimer,
    validateReduserteArbeidProsent,
    validateRequiredField,
    validateNormaleArbeidstimer
} from 'app/validation/fieldValidations';
import { Field, AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { InjectedIntlProps, injectIntl, InjectedIntl, FormattedMessage } from 'react-intl';
import Box from '../box/Box';
import Panel from '../panel/Panel';
import YesOrNoQuestion from '../yes-or-no-question/YesOrNoQuestion';
import { YesOrNo } from 'app/types/YesOrNo';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { timeToDecimalTime, isValidTime, timeToString } from 'app/utils/timeUtils';
import TimeInput from '../time-input/TimeInput';
import { calculateArbeidstimerFraProsent, calculateRedusertArbeidsukeprosent } from 'app/utils/ansettelsesforholdUtils';
import { Time } from 'app/types/Time';

interface Props {
    formiInputNamePrefix: string;
    forhold: AnsettelsesforholdForm;
}

const getRedusertProsentIntlValues = ({
    timer_normalt,
    timer_redusert
}: AnsettelsesforholdForm): { pst: number } | undefined => {
    if (isValidTime(timer_normalt) && isValidTime(timer_redusert)) {
        return {
            pst: parseFloat(calculateRedusertArbeidsukeprosent(timer_normalt, timer_redusert).toFixed(2))
        };
    }
    return undefined;
};

const getReduserteTimerTekst = (forhold: AnsettelsesforholdForm, intl: InjectedIntl): string => {
    const { timer_normalt, prosent_redusert, pstEllerTimer } = forhold;
    if (timer_normalt === undefined || prosent_redusert === undefined || pstEllerTimer === undefined) {
        return '';
    }
    const tid: Time = calculateArbeidstimerFraProsent(timer_normalt, prosent_redusert);
    return timeToString(tid, intl);
};

const getLabelForProsentInput = (forhold: AnsettelsesforholdForm, intl: InjectedIntl): string => {
    return intlHelper(
        intl,
        forhold.prosent_redusert
            ? 'gradertAnsettelsesforhold.redusertProsentLabel'
            : 'gradertAnsettelsesforhold.redusertProsentLabel_utenVerdi',
        {
            timerNormalt: timeToString(forhold.timer_normalt!, intl),
            timerRedusert: getReduserteTimerTekst(forhold, intl)
        }
    );
};

const getLabelForTimerInput = (forhold: AnsettelsesforholdForm, intl: InjectedIntl): string =>
    intlHelper(
        intl,
        forhold.timer_redusert
            ? 'gradertAnsettelsesforhold.timerPerUkeLabel'
            : 'gradertAnsettelsesforhold.timerPerUkeLabel_utenVerdi',
        getRedusertProsentIntlValues(forhold)
    );

const AnsettelsesforholdDetaljer: React.FunctionComponent<Props & InjectedIntlProps> = ({
    forhold,
    formiInputNamePrefix,
    intl
}) => {
    const getInputName = (input: string): Field => `${formiInputNamePrefix}${input}` as Field;
    const timerNormalt = forhold.timer_normalt ? timeToDecimalTime(forhold.timer_normalt) : 0;
    return (
        <Box padBottom="m">
            <Panel border={true}>
                <TimeInput
                    validate={(value: any) => validateNormaleArbeidstimer(value, true)}
                    name={getInputName('timer_normalt')}
                    label={intlHelper(intl, 'gradertAnsettelsesforhold.timer_arbeidsuke', {
                        navn: forhold.navn
                    })}
                />
                {forhold.timer_normalt !== undefined && !isNaN(timerNormalt) && (
                    <Box margin="xl">
                        <YesOrNoQuestion
                            name={getInputName('skalArbeide')}
                            validate={validateRequiredField}
                            legend={`Skal du jobbe hos ${forhold.navn} i denne perioden?`}
                        />
                    </Box>
                )}
                {forhold.skalArbeide === YesOrNo.YES && (
                    <Box margin="xl" className="timerEllerProsent">
                        <RadioPanelGroup
                            name={getInputName('pstEllerTimer')}
                            legend={intlHelper(intl, 'gradertAnsettelsesforhold.timer_redusert')}
                            validate={validateRequiredField}
                            style="radio"
                            radios={[
                                {
                                    value: HoursOrPercent.hours,
                                    label: (
                                        <span className="timerEllerProsent__label">
                                            <FormattedMessage id="gradertAnsettelsesforhold.oppgiTimer" />
                                        </span>
                                    ),
                                    key: 'hours'
                                },
                                {
                                    value: HoursOrPercent.percent,
                                    label: (
                                        <span className="timerEllerProsent__label">
                                            <FormattedMessage id="gradertAnsettelsesforhold.oppgiProsent" />
                                        </span>
                                    ),
                                    key: 'percent'
                                }
                            ]}
                            childFormRenderer={
                                forhold.pstEllerTimer === undefined
                                    ? undefined
                                    : () => {
                                          return forhold.pstEllerTimer === HoursOrPercent.hours ? (
                                              <Box margin="xl">
                                                  <TimeInput
                                                      validate={(value) =>
                                                          validateReduserteArbeidTimer(
                                                              value,
                                                              forhold.timer_normalt,
                                                              true
                                                          )
                                                      }
                                                      name={getInputName('timer_redusert')}
                                                      label={getLabelForTimerInput(forhold, intl)}
                                                  />
                                              </Box>
                                          ) : (
                                              <Box margin="xl">
                                                  <Input
                                                      inputClassName="input--timer"
                                                      type="number"
                                                      min={0}
                                                      max={100}
                                                      validate={(value) => validateReduserteArbeidProsent(value, true)}
                                                      name={getInputName('prosent_redusert')}
                                                      label={getLabelForProsentInput(forhold, intl)}
                                                      value={forhold.prosent_redusert || ''}
                                                      className="input--timer"
                                                  />
                                              </Box>
                                          );
                                      }
                            }
                        />
                    </Box>
                )}
            </Panel>
        </Box>
    );
};

export default injectIntl(AnsettelsesforholdDetaljer);
