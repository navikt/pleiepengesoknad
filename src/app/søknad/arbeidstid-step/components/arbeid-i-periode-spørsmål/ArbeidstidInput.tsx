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
import { Arbeidsuke } from './ArbeidstidUkerSpørsmål';
import {
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerPerUkeISnittValidator,
} from './validationArbeidIPeriodeSpørsmål';

interface Props {
    arbeidsuke?: Arbeidsuke;
    parentFieldName: string;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    timerEllerProsent: TimerEllerProsent;
    intlValues: ArbeidIPeriodeIntlValues;
    arbeidIPeriode: ArbeidIPeriodeFormValues;
}

const ArbeidstidInput: React.FunctionComponent<Props> = ({
    arbeidsuke,
    parentFieldName,
    timerEllerProsent,
    intlValues,
    normalarbeidstid,
    arbeidIPeriode,
}) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidIPeriodeFormField) => `${parentFieldName}.${field}`;

    const prosentFieldName: any = getFieldName(ArbeidIPeriodeFormField.prosentAvNormalt);
    const timerFieldName: any = getFieldName(ArbeidIPeriodeFormField.snittTimerPerUke);

    /** Arbeid som gjelder arbeidsuke eller snitt */
    const prosentAvNormalt = arbeidsuke
        ? arbeidIPeriode.arbeidsuker
            ? arbeidIPeriode.arbeidsuker[arbeidsuke.ukeKey]?.prosentAvNormalt
            : undefined
        : arbeidIPeriode.prosentAvNormalt;

    const arbeiderProsentNumber = prosentAvNormalt ? getNumberFromNumberInputValue(prosentAvNormalt) : undefined;

    const timerNormaltString = formatTimerOgMinutter(
        intl,
        decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
    );

    const getProsentLabel = () => {
        return arbeidsuke
            ? `Uke ${arbeidsuke.ukenummer}`
            : intlHelper(intl, 'arbeidIPeriode.prosentAvNormalt.spm', intlValues);
    };

    const getTimerLabel = () => {
        return intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.spm', {
            ...intlValues,
            timerNormaltString,
        });
    };

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

    return (
        <FormBlock paddingBottom="m" margin={arbeidsuke ? 'none' : undefined}>
            {timerEllerProsent === TimerEllerProsent.PROSENT && (
                <SøknadFormComponents.NumberInput
                    name={prosentFieldName}
                    label={getProsentLabel()}
                    data-testid="prosent-verdi"
                    validate={getArbeidIPeriodeProsentAvNormaltValidator(
                        intlValues,
                        arbeidsuke ? { max: 100, min: 0 } : undefined
                    )}
                    bredde="XS"
                    maxLength={4}
                    suffixStyle="text"
                    suffix={getProsentSuffix()}
                />
            )}
            {timerEllerProsent === TimerEllerProsent.TIMER && (
                <SøknadFormComponents.NumberInput
                    name={timerFieldName}
                    label={getTimerLabel()}
                    validate={getArbeidIPeriodeTimerPerUkeISnittValidator(
                        intl,
                        intlValues,
                        normalarbeidstid.timerPerUkeISnitt,
                        arbeidsuke ? 0 : undefined
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
            )}
        </FormBlock>
    );
};

export default ArbeidstidInput;
