import React from 'react';
import { useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange, getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import { dateFormatter, decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import { getWeekOfYearKey } from '../../../utils/weekOfYearUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import {
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerPerUkeISnittValidator,
} from '../validationArbeidIPeriodeSpørsmål';
import { WeekOfYearInfo } from '../../../types/WeekOfYear';

interface Props {
    arbeidsuke?: WeekOfYearInfo;
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
            ? arbeidIPeriode.arbeidsuker[getWeekOfYearKey(arbeidsuke.dateRange)]?.prosentAvNormalt
            : undefined
        : arbeidIPeriode.prosentAvNormalt;

    const arbeiderProsentNumber = prosentAvNormalt ? getNumberFromNumberInputValue(prosentAvNormalt) : undefined;

    const timerNormaltString = formatTimerOgMinutter(
        intl,
        decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
    );

    const formatPeriode = (periode: DateRange): string =>
        `${dateFormatter.compact(periode.from)} - ${dateFormatter.compact(periode.to)}`;

    const ukeinfo = arbeidsuke ? `${arbeidsuke.weekNumber} - ${formatPeriode(arbeidsuke.dateRange)}` : undefined;

    const getProsentLabel = () => {
        return arbeidsuke
            ? intlHelper(
                  intl,
                  arbeidsuke ? 'arbeidIPeriode.prosentAvNormalt.uke.spm' : 'arbeidIPeriode.prosentAvNormalt.spm',
                  { ...intlValues, ukeinfo }
              )
            : intlHelper(
                  intl,
                  arbeidsuke ? 'arbeidIPeriode.prosentAvNormalt.uke.spm' : 'arbeidIPeriode.prosentAvNormalt.spm',
                  intlValues
              );
    };

    const getTimerLabel = () => {
        return arbeidsuke
            ? intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.uke.spm', {
                  ...intlValues,
                  timerNormaltString,
                  ukeinfo,
              })
            : intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.spm', {
                  ...intlValues,
                  timerNormaltString,
              });
    };

    const getTimerSuffix = () => {
        return arbeidsuke
            ? 'timer'
            : `timer av normalt ${formatTimerOgMinutter(
                  intl,
                  decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
              )} i uken.`;
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
        <FormBlock paddingBottom="l" margin={arbeidsuke ? 'm' : undefined}>
            {timerEllerProsent === TimerEllerProsent.PROSENT && (
                <SøknadFormComponents.NumberInput
                    className="arbeidstidUkeInput"
                    name={prosentFieldName}
                    label={getProsentLabel()}
                    data-testid="prosent-verdi"
                    validate={getArbeidIPeriodeProsentAvNormaltValidator(intlValues, arbeidsuke)}
                    bredde="XS"
                    maxLength={4}
                    suffixStyle="text"
                    suffix={getProsentSuffix()}
                />
            )}
            {timerEllerProsent === TimerEllerProsent.TIMER && (
                <SøknadFormComponents.NumberInput
                    className="arbeidstidUkeInput"
                    name={timerFieldName}
                    label={getTimerLabel()}
                    validate={getArbeidIPeriodeTimerPerUkeISnittValidator(
                        intl,
                        intlValues,
                        normalarbeidstid.timerPerUkeISnitt,
                        arbeidsuke
                    )}
                    data-testid="timer-verdi"
                    bredde="XS"
                    maxLength={4}
                    suffixStyle="text"
                    suffix={getTimerSuffix()}
                />
            )}
        </FormBlock>
    );
};

export default ArbeidstidInput;
