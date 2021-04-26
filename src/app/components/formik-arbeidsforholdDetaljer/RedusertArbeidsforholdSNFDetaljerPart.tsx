import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { validateRequiredField, validateRequiredNumber } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { FormikNumberInput, FormikRadioPanelGroup, getNumberFromNumberInputValue } from '@navikt/sif-common-formik';
import { AppFormField, ArbeidsforholdSNF, ArbeidsforholdSNFField } from '../../types/PleiepengesøknadFormData';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer,
} from '../../utils/arbeidsforholdUtils';
import { validateReduserteArbeidTimer } from '../../validation/fieldValidations';

interface Props {
    frilans_arbeidsforhold: ArbeidsforholdSNF;
    getFieldName: (name: ArbeidsforholdSNFField) => AppFormField;
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

const RedusertArbeidsforholdSNFDetaljerPart = ({ frilans_arbeidsforhold, getFieldName }: Props) => {
    const intl = useIntl();
    const {
        timerEllerProsent,
        jobberNormaltTimer,
        skalJobbeTimer,
        skalJobbeProsent,
        arbeidsform,
    } = frilans_arbeidsforhold;

    const jobberNormaltTimerNumber = getNumberFromNumberInputValue(jobberNormaltTimer);
    const skalJobbeTimerNumber = getNumberFromNumberInputValue(skalJobbeTimer);
    const skalJobbeProsentNum = getNumberFromNumberInputValue(skalJobbeProsent);

    return jobberNormaltTimerNumber !== undefined ? (
        <>
            {arbeidsform !== undefined && (
                <>
                    <Box margin="xl">
                        <FormikRadioPanelGroup<AppFormField>
                            name={getFieldName(ArbeidsforholdSNFField.timerEllerProsent)}
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
                            <FormikNumberInput<AppFormField>
                                name={getFieldName(ArbeidsforholdSNFField.skalJobbeTimer)}
                                label={intlHelper(intl, 'arbeidsforhold.timer.spm')}
                                suffix={getLabelForTimerRedusert(intl, jobberNormaltTimerNumber, skalJobbeTimerNumber)}
                                suffixStyle="text"
                                validate={(value: any) =>
                                    validateReduserteArbeidTimer(value, jobberNormaltTimerNumber, true)
                                }
                                value={skalJobbeTimer || ''}
                            />
                        </Box>
                    )}

                    {timerEllerProsent === 'prosent' && (
                        <>
                            <Box margin="xl">
                                <FormikNumberInput<AppFormField>
                                    name={getFieldName(ArbeidsforholdSNFField.skalJobbeProsent)}
                                    label={intlHelper(intl, 'arbeidsforhold.prosent.spm')}
                                    suffix={getLabelForProsentRedusert(
                                        intl,
                                        jobberNormaltTimerNumber,
                                        skalJobbeProsentNum
                                    )}
                                    suffixStyle="text"
                                    validate={validateRequiredNumber({ min: 1, max: 99 })}
                                    value={skalJobbeProsent || ''}
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

export default RedusertArbeidsforholdSNFDetaljerPart;
