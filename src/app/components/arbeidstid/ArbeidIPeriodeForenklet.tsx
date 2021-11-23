import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { decimalTimeToTime } from '@navikt/sif-common-core/lib/utils/timeUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriode, ArbeidIPeriodeField } from '../../types/PleiepengesøknadFormData';
import {
    calcReduserteTimerFromRedusertProsent,
    calcRedusertProsentFromRedusertTimer,
} from '../../utils/arbeidsforholdUtils';
import AppForm from '../app-form/AppForm';
import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';

interface Props {
    arbeidIPeriode: ArbeidIPeriode;
    jobberNormaltTimerNumber: number;
    getFieldName: (field: ArbeidIPeriodeField) => any;
    getSpørsmål: (spørsmål: ArbeidIPeriodeField) => any;
}

const getLabelForProsentRedusert = (intl: IntlShape, timerNormalt: number, prosentRedusert: number | undefined) => {
    if (prosentRedusert && prosentRedusert > 0) {
        const { hours: timer = 0, minutes: minutter = 0 } = decimalTimeToTime(
            calcReduserteTimerFromRedusertProsent(timerNormalt, prosentRedusert)
        );
        return intlHelper(intl, 'arbeidIPeriode.prosent.utledet.medTimer', {
            timer: timerNormalt,
            timerRedusert: intlHelper(intl, 'timerOgMinutter', { timer, minutter }),
        });
    }
    return intlHelper(intl, 'arbeidIPeriode.prosent.utledet', { timer: timerNormalt });
};

const getLabelForTimerRedusert = (intl: IntlShape, timerNormalt: number, timerRedusert: number | undefined) => {
    if (timerRedusert && timerRedusert > 0) {
        return intlHelper(intl, 'arbeidIPeriode.timer.utledet.medProsent', {
            timer: timerNormalt,
            prosentRedusert: intl.formatNumber(calcRedusertProsentFromRedusertTimer(timerNormalt, timerRedusert), {
                style: 'decimal',
            }),
        });
    }
    return intlHelper(intl, 'arbeidIPeriode.timer.utledet', { timer: timerNormalt });
};
const ArbeidIPeriodeForenklet: React.FunctionComponent<Props> = ({
    arbeidIPeriode,
    jobberNormaltTimerNumber: jobberNormaltTimer,
    getSpørsmål,
    getFieldName,
}) => {
    const intl = useIntl();
    const { timerEllerProsent, skalJobbeProsent, skalJobbeTimer } = arbeidIPeriode;
    const skalJobbeTimerNumber = getNumberFromNumberInputValue(skalJobbeTimer);
    const skalJobbeProsentNum = getNumberFromNumberInputValue(skalJobbeProsent);
    return (
        <>
            <FormBlock>
                <AppForm.RadioPanelGroup
                    name={getFieldName(ArbeidIPeriodeField.timerEllerProsent)}
                    legend={getSpørsmål(ArbeidIPeriodeField.timerEllerProsent)}
                    validate={getRequiredFieldValidator()}
                    useTwoColumns={true}
                    radios={[
                        {
                            label: intlHelper(intl, 'arbeidIPeriode.timerEllerProsent.timer'),
                            value: 'timer',
                        },
                        {
                            label: intlHelper(intl, 'arbeidIPeriode.timerEllerProsent.prosent'),
                            value: 'prosent',
                        },
                    ]}
                />
            </FormBlock>
            {timerEllerProsent === 'timer' && (
                <FormBlock>
                    <AppForm.NumberInput
                        name={getFieldName(ArbeidIPeriodeField.skalJobbeTimer)}
                        label={getSpørsmål(ArbeidIPeriodeField.skalJobbeTimer)}
                        bredde="XS"
                        suffix={getLabelForTimerRedusert(intl, jobberNormaltTimer, skalJobbeTimerNumber)}
                        suffixStyle="text"
                        value={skalJobbeTimer || ''}
                        // validate={validatorer.skalJobbeTimer}
                    />
                </FormBlock>
            )}
            {timerEllerProsent === 'prosent' && (
                <>
                    <FormBlock>
                        <AppForm.NumberInput
                            name={getFieldName(ArbeidIPeriodeField.skalJobbeProsent)}
                            label={getSpørsmål(ArbeidIPeriodeField.skalJobbeProsent)}
                            bredde="XS"
                            suffix={getLabelForProsentRedusert(intl, jobberNormaltTimer, skalJobbeProsentNum)}
                            suffixStyle="text"
                            value={skalJobbeProsent || ''}
                            // validate={validatorer.skalJobbeProsent}
                        />
                    </FormBlock>
                </>
            )}
        </>
    );
};

export default ArbeidIPeriodeForenklet;
