import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import { dateRangeToISODateRange, decimalDurationToDuration, getWeeksInDateRange } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import { WeekOfYearInfo } from '../../../types/WeekOfYear';
import { getWeekOfYearInfoFromDateRange } from '../../../utils/weekOfYearUtils';
import SøknadFormComponents from '../../SøknadFormComponents';
import { ArbeidsukeFieldName } from '../types/Arbeidsuke';
import ArbeidstidInput, { søkerKunHeleUker } from './ArbeidstidInput';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

dayjs.extend(weekOfYear);

export const getArbeidsukeKey = (week: WeekOfYearInfo): string => {
    return `${dateRangeToISODateRange(week.dateRange)}`;
};

const getArbeidsukeFieldName = (parentFieldName: string, week: WeekOfYearInfo): ArbeidsukeFieldName =>
    `${parentFieldName}.${ArbeidIPeriodeFormField.arbeidsuker}.${getArbeidsukeKey(week)}`;

interface Props {
    periode: DateRange;
    parentFieldName: string;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    timerEllerProsent: TimerEllerProsent;
    arbeidIPeriode: ArbeidIPeriodeFormValues;
    intlValues: ArbeidIPeriodeIntlValues;
}

export const getArbeidsukerIPerioden = (periode: DateRange): WeekOfYearInfo[] => {
    return getWeeksInDateRange(periode)
        .filter((uke) => dayjs(uke.from).isoWeekday() <= 5)
        .map(getWeekOfYearInfoFromDateRange);
};

const ArbeidstidUkerSpørsmål: React.FunctionComponent<Props> = ({
    periode,
    parentFieldName,
    normalarbeidstid,
    timerEllerProsent,
    arbeidIPeriode,
    intlValues,
}) => {
    const arbeidsuker = getArbeidsukerIPerioden(periode);
    const intl = useIntl();

    const timerNormaltString = formatTimerOgMinutter(
        intl,
        decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
    );

    const getIkkeHeleUkerInfo = () => {
        if (søkerKunHeleUker(periode)) {
            return undefined;
        }
        const getStarterOgSlutterTekst = () => {
            const startMidtI = dayjs(periode.from).isoWeekday() > 1;
            const slutterMidtI = dayjs(periode.to).isoWeekday() < 5;
            if (startMidtI && slutterMidtI) {
                return 'starter og slutter inne i en uke';
            }
            if (startMidtI) {
                return 'starter inne i en uke';
            }
            if (slutterMidtI) {
                return 'slutter inne i en uke';
            }
            return '';
        };

        const startSluttTekst = getStarterOgSlutterTekst();
        return (
            <ExpandableInfo title={`Når søknadsperioden ${startSluttTekst}`}>
                {timerEllerProsent === TimerEllerProsent.PROSENT ? (
                    <>
                        <p>
                            Når søknadsperioden din {startSluttTekst}, skal du oppgi hvor mange prosent du jobber av
                            normalt de dagene som er en del av søknadsperioden din. Ukedager utenfor søknadsperioden
                            trenger du ikke ta med.
                        </p>
                        <p>
                            Eksempel: Dersom søknadsperioden din starter en torsdag, og du skal jobbe 50 prosent av
                            normalt hver uke søknadsperioden, oppgir du 50 prosent for den uken. Selv om du jobber 100
                            prosent de andre dagene som er utenfor søknadsperioden. Det samme gjelder dersom perioden
                            slutter midt i en uke.
                        </p>
                    </>
                ) : (
                    <>
                        <p>
                            Når søknadsperioden din {startSluttTekst}, skal du bare oppgi hvor mange timer du jobber de
                            dagene i uken som er en del av søknadsperioden din. Dager utenfor søknadsperioden skal ikke
                            tas med.
                        </p>
                        <p>
                            Eksempel: Du jobber normalt 7,5 timer hver dag fra mandag til fredag, men skal nå jobbe 2
                            timer hver dag i stedet. Dersom søknadsperioden din da starter på en torsdag skal du bare ta
                            med timene du skal jobbe for torsdag og fredag; altså 4 timer. Tilsvarende dersom
                            søknadsperioden slutter midt i en uke.
                        </p>
                    </>
                )}
            </ExpandableInfo>
        );
    };

    return (
        <SøknadFormComponents.InputGroup
            name={`${parentFieldName}_ukerGroup` as any}
            data-testid="arbeidsuker"
            description={1 + 1 === 3 ? getIkkeHeleUkerInfo() : undefined}
            legend={intlHelper(
                intl,
                `arbeidIPeriode.ulikeUkerGruppe.${
                    timerEllerProsent === TimerEllerProsent.PROSENT ? 'prosent' : 'timer'
                }.spm`,
                { ...intlValues, timerNormaltString }
            )}>
            {arbeidsuker.map((arbeidsuke) => {
                return (
                    <div key={dateRangeToISODateRange(arbeidsuke.dateRange)}>
                        <ArbeidstidInput
                            arbeidsuke={arbeidsuke}
                            parentFieldName={getArbeidsukeFieldName(parentFieldName, arbeidsuke)}
                            arbeidIPeriode={arbeidIPeriode}
                            intlValues={intlValues}
                            normalarbeidstid={normalarbeidstid}
                            timerEllerProsent={timerEllerProsent}
                        />
                    </div>
                );
            })}
        </SøknadFormComponents.InputGroup>
    );
};

export default ArbeidstidUkerSpørsmål;
