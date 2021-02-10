import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { validateRequiredField, validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FormikInput, FormikRadioPanelGroup } from '@navikt/sif-common-formik';
import { AppFormField, Arbeidsforhold, ArbeidsforholdField } from '../../types/PleiepengesøknadFormData';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer,
} from '../../utils/arbeidsforholdUtils';
import { validateReduserteArbeidTimer } from '../../validation/fieldValidations';

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
            timerRedusert: intlHelper(intl, 'timerOgMinutter', { timer, minutter }),
        });
    }
    return intlHelper(intl, 'arbeidsforhold.prosent.utledet', { timer: timerNormalt });
};

const getLabelForTimerRedusert = (intl: IntlShape, timerNormalt: number, timerRedusert: number | undefined) => {
    if (timerRedusert && timerRedusert > 0) {
        return intlHelper(intl, 'arbeidsforhold.timer.utledet.medProsent', {
            timer: timerNormalt,
            prosentRedusert: calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert).toFixed(2),
        });
    }
    return intlHelper(intl, 'arbeidsforhold.timer.utledet', { timer: timerNormalt });
};

const RedusertArbeidsforholdDetaljerPart = ({ arbeidsforhold, getFieldName }: Props) => {
    const intl = useIntl();
    const { timerEllerProsent, jobberNormaltTimer, skalJobbeTimer, skalJobbeProsent, arbeidsform } = arbeidsforhold;
    console.log(arbeidsforhold);

    return jobberNormaltTimer ? (
        <>
            {arbeidsform !== undefined && (
                <>
                    <Box margin="xl">
                        <FormikRadioPanelGroup<AppFormField>
                            name={getFieldName(ArbeidsforholdField.timerEllerProsent)}
                            legend={intlHelper(intl, 'arbeidsforhold.hvorMye.spm')}
                            validate={validateRequiredField}
                            useTwoColumns={true}
                            radios={[
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.hvorMye.timer'),
                                    value: 'timer',
                                },
                                {
                                    label: intlHelper(intl, 'arbeidsforhold.hvorMye.prosent'),
                                    value: 'prosent',
                                },
                            ]}
                        />{' '}
                    </Box>
                    {timerEllerProsent === 'timer' && (
                        <Box margin="xl">
                            <FormikInput<AppFormField>
                                name={getFieldName(ArbeidsforholdField.skalJobbeTimer)}
                                type="number"
                                label={intlHelper(intl, 'arbeidsforhold.timer.spm')}
                                suffix={getLabelForTimerRedusert(intl, jobberNormaltTimer, skalJobbeTimer)}
                                suffixStyle="text"
                                validate={(value) => validateReduserteArbeidTimer(value, jobberNormaltTimer, true)}
                                value={skalJobbeTimer || ''}
                                min={0}
                                max={100}
                            />
                        </Box>
                    )}

                    {timerEllerProsent === 'prosent' && (
                        <>
                            <Box margin="xl">
                                <FormikInput<AppFormField>
                                    name={getFieldName(ArbeidsforholdField.skalJobbeProsent)}
                                    type="number"
                                    label={intlHelper(intl, 'arbeidsforhold.prosent.spm')}
                                    suffix={getLabelForProsentRedusert(intl, jobberNormaltTimer, skalJobbeProsent)}
                                    validate={validateRequiredNumber({ min: 1, max: 99 })}
                                    value={skalJobbeProsent || ''}
                                    min={1}
                                    max={99}
                                />
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
    ) : null;
};

export default RedusertArbeidsforholdDetaljerPart;
