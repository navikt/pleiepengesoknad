import React from 'react';
import Box from '../box/Box';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Input from '../input/Input';
import { AnsettelsesforholdForm, AnsettelsesforholdField, Field } from '../../types/PleiepengesøknadFormData';
import intlHelper from '../../utils/intlUtils';
import { validateReduserteArbeidProsent, validateRequiredField } from '../../validation/fieldValidations';
import RadioPanelGroup from '../radio-panel-group/RadioPanelGroup';
import { injectIntl, InjectedIntlProps, FormattedMessage, InjectedIntl } from 'react-intl';
import CounsellorPanel from '../counsellor-panel/CounsellorPanel';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer
} from '../../utils/ansettelsesforholdUtils';
import { decimalTimeToTime } from '../../utils/timeUtils';

interface Props {
    ansettelsesforhold: AnsettelsesforholdForm;
    getFieldName: (name: AnsettelsesforholdField) => Field;
}

const getLabelForProsentRedusert = (intl: InjectedIntl, timerNormalt: number, prosentRedusert: number | undefined) => {
    if (prosentRedusert && prosentRedusert > 0) {
        const { hours: timer = 0, minutes: minutter = 0 } = decimalTimeToTime(
            calcReduserteTimerFromRedusertProsent(timerNormalt, prosentRedusert)
        );
        return intlHelper(intl, 'gradertAnsettelsesforhold.prosent.utledet.medTimer', {
            timer: timerNormalt,
            timerRedusert: intlHelper(intl, 'timerOgMinutter', { timer, minutter })
        });
    }
    return intlHelper(intl, 'gradertAnsettelsesforhold.prosent.utledet', { timer: timerNormalt });
};

const getLabelForTimerRedusert = (intl: InjectedIntl, timerNormalt: number, timerRedusert: number | undefined) => {
    if (timerRedusert && timerRedusert > 0) {
        return intlHelper(intl, 'gradertAnsettelsesforhold.timer.utledet.medProsent', {
            timer: timerNormalt,
            prosentRedusert: calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert).toFixed(2)
        });
    }
    return intlHelper(intl, 'gradertAnsettelsesforhold.timer.utledet', { timer: timerNormalt });
};

const RedusertAnsettelsesforholdPart: React.FunctionComponent<Props & InjectedIntlProps> = ({
    ansettelsesforhold: { navn, timerEllerProsent, jobberNormaltTimer, skalJobbeTimer, skalJobbeProsent },
    getFieldName,
    intl
}) => {
    return (
        <>
            <Box margin="xl">
                <SkjemaGruppe
                    title={intlHelper(intl, 'gradertAnsettelsesforhold.iDag.spm', {
                        arbeidsforhold: navn
                    })}>
                    <Input
                        name={getFieldName(AnsettelsesforholdField.jobberNormaltTimer)}
                        type="number"
                        label={intlHelper(intl, 'gradertAnsettelsesforhold.iDag.utledet')}
                        inputClassName="input--timer"
                        validate={(value) => validateReduserteArbeidProsent(value, true)}
                        value={jobberNormaltTimer || ''}
                        labelRight={true}
                        min={0}
                        max={100}
                        maxLength={2}
                    />
                </SkjemaGruppe>
            </Box>
            {jobberNormaltTimer !== undefined && (
                <>
                    <Box margin="l">
                        <RadioPanelGroup
                            name={getFieldName(AnsettelsesforholdField.timerEllerProsent)}
                            legend={intlHelper(intl, 'gradertAnsettelsesforhold.hvorMye.spm')}
                            validate={validateRequiredField}
                            radios={[
                                {
                                    label: intlHelper(intl, 'gradertAnsettelsesforhold.hvorMye.timer'),
                                    value: 'timer',
                                    key: 'timer'
                                },
                                {
                                    label: intlHelper(intl, 'gradertAnsettelsesforhold.hvorMye.prosent'),
                                    value: 'prosent',
                                    key: 'prosent'
                                }
                            ]}
                        />
                    </Box>
                    {timerEllerProsent === 'timer' && (
                        <Box margin="l">
                            <SkjemaGruppe title={intlHelper(intl, 'gradertAnsettelsesforhold.timer.spm')}>
                                <Input
                                    name={getFieldName(AnsettelsesforholdField.skalJobbeTimer)}
                                    type="number"
                                    label={getLabelForTimerRedusert(intl, jobberNormaltTimer, skalJobbeTimer)}
                                    validate={validateRequiredField}
                                    labelRight={true}
                                    inputClassName="input--timer"
                                    value={skalJobbeTimer || ''}
                                    min={0}
                                    max={100}
                                />
                            </SkjemaGruppe>
                        </Box>
                    )}

                    {timerEllerProsent === 'prosent' && (
                        <>
                            <Box margin="l">
                                <SkjemaGruppe title={intlHelper(intl, 'gradertAnsettelsesforhold.prosent.spm')}>
                                    <Input
                                        name={getFieldName(AnsettelsesforholdField.skalJobbeProsent)}
                                        type="number"
                                        label={getLabelForProsentRedusert(intl, jobberNormaltTimer, skalJobbeProsent)}
                                        validate={validateRequiredField}
                                        labelRight={true}
                                        inputClassName="input--timer"
                                        value={skalJobbeProsent || ''}
                                        min={0}
                                        max={100}
                                    />
                                </SkjemaGruppe>
                            </Box>
                            <Box margin="xl">
                                <CounsellorPanel>
                                    <FormattedMessage id="gradertAnsettelsesforhold.prosent.veileder" />
                                </CounsellorPanel>
                            </Box>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default injectIntl(RedusertAnsettelsesforholdPart);
