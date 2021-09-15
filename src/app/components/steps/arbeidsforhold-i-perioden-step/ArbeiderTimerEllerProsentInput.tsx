import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { FormikNumberInput, getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidsforholdField } from '../../../types/PleiepengesøknadFormData';
import {
    getArbeidsforholdSkalJobbeProsentValidator,
    getArbeidsforholdSkalJobbeTimerValidator,
} from '../../../validation/fieldValidations';
import { ArbeidsforholdISøknadsperiodeIntlValues } from './ArbeidsforholdISøknadsperiode';
import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer,
} from '../../../utils/arbeidsforholdUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    timerEllerProsent: 'timer' | 'prosent' | undefined;
    jobberNormaltTimerNumber: number;
    skalJobbeTimer?: string;
    skalJobbeProsent?: string;
    intlValues: ArbeidsforholdISøknadsperiodeIntlValues;
    getFieldName: (field: string) => string;
    getSpørsmål: (spørsmål: string) => string;
}

export const getLabelForProsentRedusert = (
    intl: IntlShape,
    timerNormalt: number,
    prosentRedusert: number | undefined
) => {
    if (prosentRedusert && prosentRedusert > 0) {
        const { hours: timer = 0, minutes: minutter = 0 } = decimalTimeToTime(
            calcReduserteTimerFromRedusertProsent(timerNormalt, prosentRedusert)
        );
        return intlHelper(intl, 'arbeidsforholdIPerioden.prosent.utledet.medTimer', {
            timer: timerNormalt,
            timerRedusert: intlHelper(intl, 'timerOgMinutter', { timer, minutter }),
        });
    }
    return intlHelper(intl, 'arbeidsforholdIPerioden.prosent.utledet', { timer: timerNormalt });
};

export const getLabelForTimerRedusert = (intl: IntlShape, timerNormalt: number, timerRedusert: number | undefined) => {
    if (timerRedusert && timerRedusert > 0) {
        return intlHelper(intl, 'arbeidsforholdIPerioden.timer.utledet.medProsent', {
            timer: timerNormalt,
            prosentRedusert: intl.formatNumber(calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert), {
                style: 'decimal',
            }),
        });
    }
    return intlHelper(intl, 'arbeidsforholdIPerioden.timer.utledet', { timer: timerNormalt });
};

const ArbeiderTimerEllerProsentInput: React.FunctionComponent<Props> = ({
    timerEllerProsent,
    jobberNormaltTimerNumber,
    skalJobbeProsent,
    skalJobbeTimer,
    intlValues,
    getFieldName,
    getSpørsmål,
}) => {
    const intl = useIntl();

    if (timerEllerProsent === undefined) {
        return null;
    }
    return (
        <>
            {timerEllerProsent === 'timer' && (
                <FormBlock>
                    <FormikNumberInput
                        name={getFieldName(ArbeidsforholdField.skalJobbeTimer)}
                        label={getSpørsmål('skalJobbeTimer')}
                        bredde="XS"
                        suffix={getLabelForTimerRedusert(
                            intl,
                            jobberNormaltTimerNumber,
                            getNumberFromNumberInputValue(skalJobbeTimer)
                        )}
                        suffixStyle="text"
                        value={skalJobbeTimer || ''}
                        validate={getArbeidsforholdSkalJobbeTimerValidator(jobberNormaltTimerNumber, intlValues)}
                    />
                </FormBlock>
            )}
            {timerEllerProsent === 'prosent' && (
                <FormBlock>
                    <FormikNumberInput
                        name={getFieldName(ArbeidsforholdField.skalJobbeProsent)}
                        label={getSpørsmål('skalJobbeProsent')}
                        bredde="XS"
                        suffix={getLabelForProsentRedusert(
                            intl,
                            jobberNormaltTimerNumber,
                            getNumberFromNumberInputValue(skalJobbeProsent)
                        )}
                        suffixStyle="text"
                        value={skalJobbeProsent || ''}
                        validate={getArbeidsforholdSkalJobbeProsentValidator(intlValues)}
                    />
                </FormBlock>
            )}
        </>
    );
};

export default ArbeiderTimerEllerProsentInput;
