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
import { InjectedIntlProps, injectIntl, InjectedIntl } from 'react-intl';
import Box from '../box/Box';
import Panel from '../panel/Panel';
import YesOrNoQuestion from '../yes-or-no-question/YesOrNoQuestion';
import { YesOrNo } from 'app/types/YesOrNo';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { getDecimalTimeFromTime } from 'app/utils/timeUtils';
import TimeInput from '../time-input/TimeInput';
import { calculateArbeidstimerFraProsent } from 'app/utils/ansettelsesforholdUtils';
import { Time } from 'app/types/Time';

interface Props {
    formiInputNamePrefix: string;
    forhold: AnsettelsesforholdForm;
}

const calculateReductionPercent = (forhold: AnsettelsesforholdForm): number | undefined => {
    const { timer_normalt, timer_redusert } = forhold;
    if (timer_normalt !== undefined && timer_redusert !== undefined) {
        const normalTid = getDecimalTimeFromTime(timer_normalt);
        const redusertTid = getDecimalTimeFromTime(timer_redusert);
        return (100 / normalTid) * redusertTid;
    }
    return undefined;
};

const getRedusertProsent = (forhold: AnsettelsesforholdForm): { pst: number } | undefined => {
    const pst = calculateReductionPercent(forhold);
    return pst !== undefined
        ? {
              pst: parseFloat(pst.toFixed(2))
          }
        : undefined;
};

const getTimerOgMinutterTekst = (time: Time, intl: InjectedIntl): string => {
    if (time.minutes === 0) {
        return intlHelper(intl, 'timer', { timer: time.hours });
    }
    return intlHelper(intl, 'timerOgMinutter', { timer: time.hours, minutter: time.minutes });
};

const getReduserteTimerTekst = (forhold: AnsettelsesforholdForm, intl: InjectedIntl): string => {
    const { timer_normalt, prosent_redusert, pstEllerTimer } = forhold;
    if (timer_normalt === undefined || prosent_redusert === undefined || pstEllerTimer === undefined) {
        return '';
    }
    const tid: Time = calculateArbeidstimerFraProsent(timer_normalt, prosent_redusert);
    return getTimerOgMinutterTekst(tid, intl);
};

const getLabelForProsentInput = (forhold: AnsettelsesforholdForm, intl: InjectedIntl): string => {
    return intlHelper(
        intl,
        forhold.prosent_redusert
            ? 'gradertAnsettelsesforhold.redusertProsentLabel'
            : 'gradertAnsettelsesforhold.redusertProsentLabel_utenVerdi',
        {
            timerNormalt: getTimerOgMinutterTekst(forhold.timer_normalt!, intl),
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
        getRedusertProsent(forhold)
    );

const AnsettelsesforholdDetaljer: React.FunctionComponent<Props & InjectedIntlProps> = ({
    forhold,
    formiInputNamePrefix,
    intl
}) => {
    const getInputName = (input: string): Field => `${formiInputNamePrefix}${input}` as Field;
    const timerNormalt = forhold.timer_normalt ? getDecimalTimeFromTime(forhold.timer_normalt) : 0;
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
                    <Box margin="l">
                        <YesOrNoQuestion
                            name={getInputName('skalArbeide')}
                            validate={validateRequiredField}
                            legend={`Skal du jobbe hos ${forhold.navn} i denne perioden?`}
                        />
                    </Box>
                )}
                {forhold.skalArbeide === YesOrNo.YES && (
                    <Box margin="s" className="timerEllerProsent">
                        <RadioPanelGroup
                            name={getInputName('pstEllerTimer')}
                            legend={intlHelper(intl, 'gradertAnsettelsesforhold.timer_redusert')}
                            validate={validateRequiredField}
                            style="radio"
                            radios={[
                                {
                                    value: HoursOrPercent.hours,
                                    label: <span className="timerEllerProsent__label">Oppgi antall timer</span>,
                                    key: 'hours'
                                },
                                {
                                    value: HoursOrPercent.percent,
                                    label: <span className="timerEllerProsent__label">Oppgi antall prosent</span>,
                                    key: 'percent'
                                }
                            ]}
                            childFormRenderer={
                                forhold.pstEllerTimer === undefined
                                    ? undefined
                                    : () => {
                                          return forhold.pstEllerTimer === HoursOrPercent.hours ? (
                                              <>
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
                                              </>
                                          ) : (
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
