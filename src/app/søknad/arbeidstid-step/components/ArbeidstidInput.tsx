import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import { dateFormatter, dateRangeUtils, decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { Normaltekst } from 'nav-frontend-typografi';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import { ArbeidsukeInfo } from '../../../types/ArbeidsukeInfo';
import SøknadFormComponents from '../../SøknadFormComponents';
import { getArbeidsdagerIUkeTekst } from '../utils/arbeidstidUtils';
import {
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerPerUkeISnittValidator,
} from '../validationArbeidIPeriodeSpørsmål';

interface Props {
    arbeidsuke?: ArbeidsukeInfo;
    parentFieldName: string;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    timerEllerProsent: TimerEllerProsent;
    intlValues: ArbeidIPeriodeIntlValues;
    arbeidIPeriode: ArbeidIPeriodeFormValues;
    frilans?: boolean;
}

export const søkerKunHeleUker = (periode: DateRange): boolean => {
    return (
        dayjs(periode.from).isoWeekday() === 1 &&
        dayjs(periode.to).isoWeekday() >= 5 &&
        dateRangeUtils.getNumberOfDaysInDateRange(periode) >= 5
    );
};

const ArbeidstidInput: React.FunctionComponent<Props> = ({
    arbeidsuke,
    parentFieldName,
    timerEllerProsent,
    intlValues,
    normalarbeidstid,
    frilans,
}) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidIPeriodeFormField) => `${parentFieldName}.${field}`;

    const prosentFieldName: any = getFieldName(ArbeidIPeriodeFormField.prosentAvNormalt);
    const timerFieldName: any = getFieldName(ArbeidIPeriodeFormField.snittTimerPerUke);

    const timerNormaltString = formatTimerOgMinutter(
        intl,
        decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
    );

    const formatPeriode = (periode: DateRange): string =>
        `${dateFormatter.compact(periode.from)} - ${dateFormatter.compact(periode.to)}`;

    const ukenummer = arbeidsuke ? `${arbeidsuke.ukenummer}` : undefined;
    const ukedatoer = arbeidsuke ? `${formatPeriode(arbeidsuke.periode)}` : undefined;

    const getProsentLabel = () => {
        return arbeidsuke ? (
            <>
                <FormattedMessage id="arbeidIPeriode.uke.ukenummer" values={{ ukenummer }} />
                <br />
                <Normaltekst>
                    <FormattedMessage id="arbeidIPeriode.uke.ukedatoer" values={{ ukedatoer }} />
                </Normaltekst>
            </>
        ) : (
            intlHelper(
                intl,
                arbeidsuke ? 'arbeidIPeriode.prosentAvNormalt.uke.spm' : 'arbeidIPeriode.prosentAvNormalt.spm',
                intlValues
            )
        );
    };

    const getTimerLabel = () => {
        return arbeidsuke ? (
            <>
                <FormattedMessage id="arbeidIPeriode.uke.ukenummer" values={{ ukenummer }} />
                <br />
                <Normaltekst>
                    <FormattedMessage id="arbeidIPeriode.uke.ukedatoer" values={{ ukedatoer }} />
                </Normaltekst>
            </>
        ) : frilans ? (
            intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.frilanser.spm')
        ) : (
            intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.spm', {
                ...intlValues,
                timerNormaltString,
            })
        );
    };

    const getTimerSuffix = () => {
        if (arbeidsuke && arbeidsuke.arbeidsdagerPeriode) {
            return `timer (${getArbeidsdagerIUkeTekst(arbeidsuke.arbeidsdagerPeriode)})`;
        }
        return 'timer';
    };

    const getProsentSuffix = () => {
        if (arbeidsuke && arbeidsuke.arbeidsdagerPeriode) {
            return `prosent av normalt (${getArbeidsdagerIUkeTekst(arbeidsuke.arbeidsdagerPeriode)})`;
        }
        return `prosent av normalt`;
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
