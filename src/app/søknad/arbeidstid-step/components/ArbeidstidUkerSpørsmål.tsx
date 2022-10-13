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
import ArbeidstidInput from './ArbeidstidInput';

dayjs.extend(weekOfYear);

const getArbeidsukeFieldKey = (uke: DateRange): string => dateRangeToISODateRange(uke);

const getArbeidsukeFieldName = (parentFieldName: string, week: WeekOfYearInfo): ArbeidsukeFieldName =>
    `${parentFieldName}.${ArbeidIPeriodeFormField.arbeidsuker}.${getArbeidsukeFieldKey(week.dateRange)}`;

interface Props {
    periode: DateRange;
    parentFieldName: string;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    timerEllerProsent: TimerEllerProsent;
    arbeidIPeriode: ArbeidIPeriodeFormValues;
    intlValues: ArbeidIPeriodeIntlValues;
}

const ArbeidstidUkerSpørsmål: React.FunctionComponent<Props> = ({
    periode,
    parentFieldName,
    normalarbeidstid,
    timerEllerProsent,
    arbeidIPeriode,
    intlValues,
}) => {
    const arbeidsuker = getWeeksInDateRange(periode).map(getWeekOfYearInfoFromDateRange);
    const intl = useIntl();

    const timerNormaltString = formatTimerOgMinutter(
        intl,
        decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
    );

    return (
        <SøknadFormComponents.InputGroup
            name={`${parentFieldName}_ukerGroup` as any}
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
