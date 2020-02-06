import React from 'react';
import Box from 'common/components/box/Box';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import { Arbeidsforhold, ArbeidsforholdField, AppFormField } from '../../types/PleiepengesøknadFormData';
import intlHelper from 'common/utils/intlUtils';
import { validateReduserteArbeidProsent } from '../../validation/fieldValidations';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer
} from '../../utils/arbeidsforholdUtils';
import { decimalTimeToTime } from 'common/utils/timeUtils';
import './timerInput.less';
import FormikInput from '../../../common/formik/formik-input/FormikInput';
import FormikRadioPanelGroup from '../../../common/formik/formik-radio-panel-group/FormikRadioPanelGroup';
import { validateRequiredField } from 'common/validation/commonFieldValidations';
import FormikInput from 'common/formik/formik-input/FormikInput';
import FormikRadioPanelGroup from 'common/formik/formik-radio-panel-group/FormikRadioPanelGroup';

interface Props {
    arbeidsforhold: Arbeidsforhold;
    getFieldName: (name: ArbeidsforholdField) => AppFormField;
}

const getLabelForProsentRedusert = (intl: IntlShape, timerNormalt: number, prosentRedusert: number | undefined) => {
    if (prosentRedusert && prosentRedusert > 0) {
        const { hours: timer = 0, minutes: minutter = 0 } = decimalTimeToTime(
            calcReduserteTimerFromRedusertProsent(timerNormalt, prosentRedusert)
        );
        return intlHelper(intl, 'arbeidsforhold.prosent.utledet.medTimer', {
            timer: timerNormalt,
            timerRedusert: intlHelper(intl, 'timerOgMinutter', { timer, minutter })
        });
    }
    return intlHelper(intl, 'arbeidsforhold.prosent.utledet', { timer: timerNormalt });
};

const getLabelForTimerRedusert = (intl: IntlShape, timerNormalt: number, timerRedusert: number | undefined) => {
    if (timerRedusert && timerRedusert > 0) {
        return intlHelper(intl, 'arbeidsforhold.timer.utledet.medProsent', {
            timer: timerNormalt,
            prosentRedusert: calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert).toFixed(2)
        });
    }
    return intlHelper(intl, 'arbeidsforhold.timer.utledet', { timer: timerNormalt });
};

const RedusertArbeidsforholdPart: React.FunctionComponent<Props> = ({
    arbeidsforhold: { navn, timerEllerProsent, jobberNormaltTimer, skalJobbeTimer, skalJobbeProsent },
    getFieldName
}) => {
    const intl = useIntl();
    return (
        <>
            <Box margin="xl">
                <SkjemaGruppe
                    title={intlHelper(intl, 'arbeidsforhold.iDag.spm', {
                        arbeidsforhold: navn
                    })}>
                    <FormikInput<AppFormField>
                        name={getFieldName(ArbeidsforholdField.jobberNormaltTimer)}
                        type="number"
                        label={intlHelper(intl, 'arbeidsforhold.iDag.utledet')}
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
                        <FormikRadioPanelGroup<AppFormField>
                            name={getFieldName(ArbeidsforholdField.timerEllerProsent)}
                            legend={intlHelper(intl, 'arbeidsforhold.hvorMye.spm')}
                            validate={validateRequiredField}
                            radios={[
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.hvorMye.timer'),
                                    value: 'timer',
                                    key: 'timer'
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.hvorMye.prosent'),
                                    value: 'prosent',
                                    key: 'prosent'
                                }
                            ]}
                        />
                    </Box>
                    {timerEllerProsent === 'timer' && (
                        <Box margin="l">
                            <SkjemaGruppe title={intlHelper(intl, 'arbeidsforhold.timer.spm')}>
                                <FormikInput<AppFormField>
                                    name={getFieldName(ArbeidsforholdField.skalJobbeTimer)}
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
                                <SkjemaGruppe title={intlHelper(intl, 'arbeidsforhold.prosent.spm')}>
                                    <FormikInput<AppFormField>
                                        name={getFieldName(ArbeidsforholdField.skalJobbeProsent)}
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
                                    <FormattedMessage id="arbeidsforhold.prosent.veileder" />
                                </CounsellorPanel>
                            </Box>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default RedusertArbeidsforholdPart;
