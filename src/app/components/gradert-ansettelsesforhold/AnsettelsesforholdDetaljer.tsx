import React from 'react';
import Input from '../input/Input';
import intlHelper from 'app/utils/intlUtils';
import { HoursOrPercent } from 'app/types/Søkerdata';
import {
    validateNormaleArbeidstimer,
    validateReduserteArbeidTimer,
    validateReduserteArbeidProsent,
    validateRequiredField
} from 'app/validation/fieldValidations';
import { Field, AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { InjectedIntlProps, injectIntl, InjectedIntl } from 'react-intl';
import Box from '../box/Box';
import Panel from '../panel/Panel';
import YesOrNoQuestion from '../yes-or-no-question/YesOrNoQuestion';
import { YesOrNo } from 'app/types/YesOrNo';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { calculateRedusertArbeidsuke } from 'app/utils/ansettelsesforholdUtils';

interface Props {
    formiInputNamePrefix: string;
    forhold: AnsettelsesforholdForm;
}

const calculateReductionPercent = (forhold: AnsettelsesforholdForm): number | undefined => {
    const { normal_arbeidsuke, redusert_arbeidsuke } = forhold;
    if (normal_arbeidsuke !== undefined && redusert_arbeidsuke !== undefined) {
        return (100 / normal_arbeidsuke) * redusert_arbeidsuke;
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

const getReduserteTimer = (forhold: AnsettelsesforholdForm): string => {
    const { redusert_arbeidsuke, pstEllerTimer, normal_arbeidsuke } = forhold;
    if (normal_arbeidsuke === undefined || redusert_arbeidsuke === undefined || pstEllerTimer === undefined) {
        return '';
    }
    const pst = calculateRedusertArbeidsuke(normal_arbeidsuke, redusert_arbeidsuke, pstEllerTimer);
    return `${pst}`;
};

const getLabelForProsentInput = (forhold: AnsettelsesforholdForm, intl: InjectedIntl): string =>
    intlHelper(
        intl,
        forhold.redusert_arbeidsuke
            ? 'gradertAnsettelsesforhold.redusertProsentLabel'
            : 'gradertAnsettelsesforhold.redusertProsentLabel_utenVerdi',
        {
            timer: forhold.normal_arbeidsuke,
            redusertTimer: getReduserteTimer(forhold)
        }
    );

const getLabelForTimerInput = (forhold: AnsettelsesforholdForm, intl: InjectedIntl): string =>
    intlHelper(
        intl,
        forhold.redusert_arbeidsuke
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

    return (
        <Box padBottom="m">
            <Panel border={true}>
                <Input
                    inputClassName="input--timer"
                    type="number"
                    min={0}
                    validate={(value: any) => validateNormaleArbeidstimer(value, true)}
                    name={getInputName('normal_arbeidsuke')}
                    label={intlHelper(intl, 'gradertAnsettelsesforhold.timer_arbeidsuke', {
                        navn: forhold.navn
                    })}
                    value={forhold.normal_arbeidsuke || ''}
                />
                {forhold.normal_arbeidsuke !== undefined && !isNaN(forhold.normal_arbeidsuke) && (
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
                                    label: 'Timer',
                                    key: 'hours'
                                },
                                {
                                    value: HoursOrPercent.percent,
                                    label: 'Prosent',
                                    key: 'percent'
                                }
                            ]}
                            childFormRenderer={
                                forhold.pstEllerTimer === undefined
                                    ? undefined
                                    : () => {
                                          return forhold.pstEllerTimer === HoursOrPercent.hours ? (
                                              <Input
                                                  inputClassName="input--timer"
                                                  type="number"
                                                  min={0}
                                                  validate={(value) =>
                                                      validateReduserteArbeidTimer(
                                                          value,
                                                          forhold.normal_arbeidsuke,
                                                          true
                                                      )
                                                  }
                                                  name={getInputName('redusert_arbeidsuke')}
                                                  label={getLabelForTimerInput(forhold, intl)}
                                                  value={forhold.redusert_arbeidsuke || ''}
                                                  className="input--timer"
                                              />
                                          ) : (
                                              <Input
                                                  inputClassName="input--timer"
                                                  type="number"
                                                  min={0}
                                                  max={100}
                                                  validate={(value) => validateReduserteArbeidProsent(value, true)}
                                                  name={getInputName('redusert_arbeidsuke')}
                                                  label={getLabelForProsentInput(forhold, intl)}
                                                  value={forhold.redusert_arbeidsuke || ''}
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
