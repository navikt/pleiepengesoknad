import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { FormikInput, FormikRadioPanelGroup } from '@navikt/sif-common-formik/lib';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import intlHelper from 'common/utils/intlUtils';
import { decimalTimeToTime } from 'common/utils/timeUtils';
import { validateRequiredField } from 'common/validation/fieldValidations';
import {
    AppFormField, Arbeidsforhold, ArbeidsforholdField
} from '../../types/PleiepengesøknadFormData';
import {
    calcReduserteTimerFromRedusertProsent, calcRedusertProsentFromRedusertTimer
} from '../../utils/arbeidsforholdUtils';
import './timerInput.less';

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
                                    value: 'timer'
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.hvorMye.prosent'),
                                    value: 'prosent'
                                }
                            ]}
                        />
                    </Box>
                    {timerEllerProsent === 'timer' && (
                        <Box margin="l">
                            <SkjemaGruppe legend={intlHelper(intl, 'arbeidsforhold.timer.spm')}>
                                <FormikInput<AppFormField>
                                    name={getFieldName(ArbeidsforholdField.skalJobbeTimer)}
                                    type="number"
                                    label={getLabelForTimerRedusert(intl, jobberNormaltTimer, skalJobbeTimer)}
                                    validate={validateRequiredField}
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
                                <SkjemaGruppe legend={intlHelper(intl, 'arbeidsforhold.prosent.spm')}>
                                    <FormikInput<AppFormField>
                                        name={getFieldName(ArbeidsforholdField.skalJobbeProsent)}
                                        type="number"
                                        label={getLabelForProsentRedusert(intl, jobberNormaltTimer, skalJobbeProsent)}
                                        validate={validateRequiredField}
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
