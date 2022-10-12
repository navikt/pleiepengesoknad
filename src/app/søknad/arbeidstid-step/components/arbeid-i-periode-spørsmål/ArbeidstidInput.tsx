import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import { decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import React from 'react';
import { useIntl } from 'react-intl';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import SøknadFormComponents from '../../../SøknadFormComponents';
import {
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerPerUkeISnittValidator,
} from './validationArbeidIPeriodeSpørsmål';

interface Props {
    parentFieldName: string;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    timerEllerProsent: TimerEllerProsent;
    intlValues: ArbeidIPeriodeIntlValues;
    arbeidIPeriode: ArbeidIPeriodeFormValues;
}

const ArbeidstidInput: React.FunctionComponent<Props> = ({
    parentFieldName,
    timerEllerProsent,
    intlValues,
    normalarbeidstid,
    arbeidIPeriode,
}) => {
    const intl = useIntl();

    const arbeiderProsentNumber = arbeidIPeriode?.prosentAvNormalt
        ? getNumberFromNumberInputValue(arbeidIPeriode?.prosentAvNormalt)
        : undefined;

    const getProsentSuffix = () => {
        const normalttimer = formatTimerOgMinutter(intl, decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt));
        const nyTid =
            timerEllerProsent === TimerEllerProsent.PROSENT && arbeiderProsentNumber !== undefined
                ? formatTimerOgMinutter(
                      intl,
                      decimalDurationToDuration((normalarbeidstid.timerPerUkeISnitt / 100) * arbeiderProsentNumber)
                  )
                : undefined;

        return `prosent av normalt ${normalttimer} i uken${nyTid ? ` (tilsvarer ${nyTid} i uken)` : ''}`;
    };

    const getFieldName = (field: ArbeidIPeriodeFormField) => `${parentFieldName}.${field}`;

    const timerNormaltString = formatTimerOgMinutter(
        intl,
        decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
    );

    return (
        <>
            <FormBlock>
                {timerEllerProsent === TimerEllerProsent.PROSENT && (
                    <FormBlock margin="l">
                        <SøknadFormComponents.NumberInput
                            name={getFieldName(ArbeidIPeriodeFormField.prosentAvNormalt) as any}
                            label={intlHelper(intl, 'arbeidIPeriode.prosentAvNormalt.spm', intlValues)}
                            data-testid="prosent-verdi"
                            validate={getArbeidIPeriodeProsentAvNormaltValidator(intlValues)}
                            bredde="XS"
                            maxLength={4}
                            suffixStyle="text"
                            suffix={getProsentSuffix()}
                        />
                    </FormBlock>
                )}
                {timerEllerProsent === TimerEllerProsent.TIMER && (
                    <FormBlock margin="l">
                        <SøknadFormComponents.NumberInput
                            name={getFieldName(ArbeidIPeriodeFormField.snittTimerPerUke) as any}
                            label={intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.spm', {
                                ...intlValues,
                                timerNormaltString,
                            })}
                            validate={getArbeidIPeriodeTimerPerUkeISnittValidator(
                                intl,
                                intlValues,
                                normalarbeidstid.timerPerUkeISnitt
                            )}
                            data-testid="timer-verdi"
                            bredde="XS"
                            maxLength={4}
                            suffixStyle="text"
                            suffix={`timer av normalt ${formatTimerOgMinutter(
                                intl,
                                decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
                            )} i uken.`}
                        />
                    </FormBlock>
                )}
            </FormBlock>
        </>
    );
};

export default ArbeidstidInput;
