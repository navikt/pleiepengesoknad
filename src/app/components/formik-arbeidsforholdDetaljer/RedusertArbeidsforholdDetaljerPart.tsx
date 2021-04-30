import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik';
import { getNumberValidator, getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { AppFormField, Arbeidsforhold, ArbeidsforholdField } from '../../types/PleiepengesøknadFormData';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer,
} from '../../utils/arbeidsforholdUtils';
import { validateReduserteArbeidTimer } from '../../validation/fieldValidations';
import AppForm from '../app-form/AppForm';

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
            prosentRedusert: intl.formatNumber(calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert), {
                style: 'decimal',
            }),
        });
    }
    return intlHelper(intl, 'arbeidsforhold.timer.utledet', { timer: timerNormalt });
};

const RedusertArbeidsforholdDetaljerPart = ({ arbeidsforhold, getFieldName }: Props) => {
    const intl = useIntl();
    const { timerEllerProsent, jobberNormaltTimer, skalJobbeTimer, skalJobbeProsent, arbeidsform } = arbeidsforhold;

    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);
    const skalJobbeTimerNumber = getNumberFromNumberInputValue(skalJobbeTimer);
    const skalJobbeProsentNum = getNumberFromNumberInputValue(skalJobbeProsent);

    return jobberNormaltTimerNumber !== undefined ? (
        <>
            {arbeidsform !== undefined && (
                <>
                    <Box margin="xl">
                        <AppForm.RadioPanelGroup
                            name={getFieldName(ArbeidsforholdField.timerEllerProsent)}
                            legend={intlHelper(intl, 'arbeidsforhold.hvorMye.spm')}
                            validate={(values) =>
                                getRequiredFieldValidator()(values)
                                    ? {
                                          key: 'validation.arbeidsforhold.timerEllerProsent',
                                          values: { navn: arbeidsforhold.navn },
                                          keepKeyUnaltered: true,
                                      }
                                    : undefined
                            }
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
                        />
                    </Box>
                    {timerEllerProsent === 'timer' && (
                        <Box margin="xl">
                            <AppForm.NumberInput
                                name={getFieldName(ArbeidsforholdField.skalJobbeTimer)}
                                label={intlHelper(intl, 'arbeidsforhold.timer.spm')}
                                suffix={getLabelForTimerRedusert(intl, jobberNormaltTimerNumber, skalJobbeTimerNumber)}
                                suffixStyle="text"
                                value={skalJobbeTimer || ''}
                                validate={(value: any) => {
                                    const error = validateReduserteArbeidTimer(value, jobberNormaltTimerNumber);
                                    return error
                                        ? {
                                              key: `validation.arbeidsforhold.skalJobbeTimer.${error}`,
                                              values: { navn: arbeidsforhold.navn },
                                              keepKeyUnaltered: true,
                                          }
                                        : undefined;
                                }}
                            />
                        </Box>
                    )}

                    {timerEllerProsent === 'prosent' && (
                        <>
                            <Box margin="xl">
                                <AppForm.NumberInput
                                    name={getFieldName(ArbeidsforholdField.skalJobbeProsent)}
                                    label={intlHelper(intl, 'arbeidsforhold.prosent.spm')}
                                    suffix={getLabelForProsentRedusert(
                                        intl,
                                        jobberNormaltTimerNumber,
                                        skalJobbeProsentNum
                                    )}
                                    suffixStyle="text"
                                    value={skalJobbeProsent || ''}
                                    validate={(values) => {
                                        const error = getNumberValidator({ required: true, min: 1, max: 99 })(values);
                                        return error
                                            ? {
                                                  key: `validation.arbeidsforhold.skalJobbeProsent.${error}`,
                                                  values: { navn: arbeidsforhold.navn },
                                                  keepKeyUnaltered: true,
                                              }
                                            : undefined;
                                    }}
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
