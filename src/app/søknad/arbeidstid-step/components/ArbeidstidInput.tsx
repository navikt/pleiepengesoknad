import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
// import { DateRange, getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import { dateFormatter, dateRangeUtils, decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/normalarbeidstidSøknadsdata';
// import { getWeekOfYearKey } from '../../../utils/weekOfYearUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import {
    getArbeidIPeriodeProsentAvNormaltValidator,
    getArbeidIPeriodeTimerPerUkeISnittValidator,
} from '../validationArbeidIPeriodeSpørsmål';
import { WeekOfYearInfo } from '../../../types/WeekOfYear';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import { Normaltekst } from 'nav-frontend-typografi';
import dayjs from 'dayjs';

interface Props {
    arbeidsuke?: WeekOfYearInfo;
    parentFieldName: string;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    timerEllerProsent: TimerEllerProsent;
    intlValues: ArbeidIPeriodeIntlValues;
    arbeidIPeriode: ArbeidIPeriodeFormValues;
    periode?: DateRange;
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
    periode,
    // arbeidIPeriode,
}) => {
    const intl = useIntl();

    const getFieldName = (field: ArbeidIPeriodeFormField) => `${parentFieldName}.${field}`;

    const prosentFieldName: any = getFieldName(ArbeidIPeriodeFormField.prosentAvNormalt);
    const timerFieldName: any = getFieldName(ArbeidIPeriodeFormField.snittTimerPerUke);

    /** Arbeid som gjelder arbeidsuke eller snitt */
    // const prosentAvNormalt = arbeidsuke
    //     ? arbeidIPeriode.arbeidsuker
    //         ? arbeidIPeriode.arbeidsuker[getWeekOfYearKey(arbeidsuke.dateRange)]?.prosentAvNormalt
    //         : undefined
    //     : arbeidIPeriode.prosentAvNormalt;

    // const arbeiderProsentNumber = prosentAvNormalt ? getNumberFromNumberInputValue(prosentAvNormalt) : undefined;

    const timerNormaltString = formatTimerOgMinutter(
        intl,
        decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
    );

    const formatPeriode = (periode: DateRange): string =>
        `${dateFormatter.compact(periode.from)} - ${dateFormatter.compact(periode.to)}`;

    const ukenummer = arbeidsuke ? `${arbeidsuke.weekNumber}` : undefined;
    const ukedatoer = arbeidsuke ? `${formatPeriode(arbeidsuke.dateRange)}` : undefined;

    const getProsentLabel = () => {
        return arbeidsuke ? (
            <>
                <FormattedMessage id="arbeidIPeriode.uke.ukenummer" values={{ ukenummer }} />
                <br />
                <Normaltekst>
                    <FormattedMessage id="arbeidIPeriode.uke.ukedatoer" values={{ ukedatoer }} />
                </Normaltekst>
                {/* {intlHelper(
                    intl,
                    arbeidsuke ? 'arbeidIPeriode.prosentAvNormalt.uke.spm' : 'arbeidIPeriode.prosentAvNormalt.spm',
                    { ...intlValues, ukenummer, ukedatoer }
                )} */}
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
        ) : (
            intlHelper(intl, 'arbeidIPeriode.timerAvNormalt.spm', {
                ...intlValues,
                timerNormaltString,
            })
        );
    };

    const getTimerSuffix = () => {
        if (1 + 1 === 3) {
            return `timer av normalt ${formatTimerOgMinutter(
                intl,
                decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
            )} i uken.`;
        }
        if (arbeidsuke) {
            const fraDag = dateFormatter.day(arbeidsuke.dateRange.from);
            const tilDag = dateFormatter.day(arbeidsuke.dateRange.to);
            return `timer ${arbeidsuke.isFullWeek ? 'hele uken' : `(${fraDag} til ${tilDag})`}`;
        }
        return 'timer';
    };

    const getProsentSuffix = () => {
        // const normalttimer = formatTimerOgMinutter(intl, decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt));
        // const nyTid =
        //     timerEllerProsent === TimerEllerProsent.PROSENT && arbeiderProsentNumber !== undefined
        //         ? formatTimerOgMinutter(
        //               intl,
        //               decimalDurationToDuration((normalarbeidstid.timerPerUkeISnitt / 100) * arbeiderProsentNumber)
        //           )
        //         : undefined;

        if (arbeidsuke) {
            if (arbeidsuke?.isFullWeek === false) {
                const fraDag = dateFormatter.day(arbeidsuke.dateRange.from);
                const tilDag = dateFormatter.day(arbeidsuke.dateRange.to);
                return fraDag === tilDag
                    ? `prosent av normalt (${fraDag})` // av normalt ${normalttimer} i uken${nyTid ? ` (tilsvarer ${nyTid} i uken)` : ''}`;
                    : `prosent av normalt (${fraDag} til  ${tilDag})`; // av normalt ${normalttimer} i uken${nyTid ? ` (tilsvarer ${nyTid} i uken)` : ''}`;
            }
            return `prosent av normalt for hele uken`; // av normalt ${normalttimer} i uken${nyTid ? ` (tilsvarer ${nyTid} i uken)` : ''}`;
        }
        return `prosent av normalt`; // av normalt ${normalttimer} i uken${nyTid ? ` (tilsvarer ${nyTid} i uken)` : ''}`;
    };

    const getIkkeFullstendigUkeInfo = () => {
        if (arbeidsuke) {
            return undefined;
            // if (arbeidsuke?.isFullWeek === false) {
            //     const fraDag = dateFormatter.day(arbeidsuke.dateRange.from);
            //     const tilDag = dateFormatter.day(arbeidsuke.dateRange.to);
            //     return (
            //         <ExpandableInfo title="Når søknadsperioden din dekker bare deler av denne uken">
            //             {timerEllerProsent === TimerEllerProsent.PROSENT ? (
            //                 <>
            //                     <p>
            //                         Når søknadsperioden din ikke dekker hele uken, skal du oppgi hvor mange prosent du
            //                         jobber av normalt de dagene som er en del av søknadsperioden din (i ditt tilfelle{' '}
            //                         {fraDag} til {tilDag}). Du skal ikke ta hensyn til de dagene i uken som er utenfor
            //                         søknadsperioden.
            //                     </p>
            //                     <p>
            //                         Eksempel: Dersom søknadsperioden din starter en torsdag, og du skal jobbe 50 prosent
            //                         av normalt hver uke søknadsperioden, oppgir du 50 prosent. Selv om du jobber 100
            //                         prosent de andre dagene som er utenfor søknadsperioden.
            //                     </p>
            //                 </>
            //             ) : (
            //                 <>
            //                     <p>
            //                         Når søknadsperioden din ikke dekker hele denne uken, skal du oppgi hvor mange timer
            //                         du jobber de dagene i uken som er en del av søknadsperioden din ({fraDag} til{' '}
            //                         {tilDag}). Dager utenfor søknadsperioden skal ikke tas med.
            //                     </p>
            //                     <p>
            //                         Eksempel: Du jobber normalt 7,5 timer hver dag fra mandag til fredag, men skal nå
            //                         jobbe 2 timer hver dag i stedet. Dersom søknadsperioden din da starter på en torsdag
            //                         skal du bare ta med timene du skal jobbe for torsdag og fredag; altså 4 timer.
            //                     </p>
            //                 </>
            //             )}
            //         </ExpandableInfo>
            //     );
            // }
            // return undefined;
        }
        return periode && søkerKunHeleUker(periode) ? undefined : (
            <ExpandableInfo title="Når søknadsperioden din starter eller slutter midt i en uke">
                {timerEllerProsent === TimerEllerProsent.PROSENT ? (
                    <>
                        Når du jobber like mye hver uke i søknadsperioden, men søknadsperioden starter eller slutter
                        midt i en uke, oppgir du den prosenten som gjelder for en hel uke.
                    </>
                ) : (
                    <>
                        Når du jobber like mange timer hver uke i søknadsperioden, men søknadsperioden starter eller
                        slutter midt i en uke, skal du oppgi antall timer som du jobber i en hel uke. Du skal ikke ta
                        hensyn til de dagene som er utenfor søknadsperioden.
                    </>
                )}
            </ExpandableInfo>
        );
    };

    const ikkeFullstendigUkeInfo = getIkkeFullstendigUkeInfo();

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
                    description={ikkeFullstendigUkeInfo}
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
                    description={ikkeFullstendigUkeInfo}
                />
            )}
        </FormBlock>
    );
};

export default ArbeidstidInput;
