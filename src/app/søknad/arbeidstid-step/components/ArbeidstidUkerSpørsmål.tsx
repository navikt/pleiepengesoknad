import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import { dateFormatter, dateRangeToISODateRange, decimalDurationToDuration } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import { WeekOfYearInfo } from '../../../types/WeekOfYear';
import SøknadFormComponents from '../../SøknadFormComponents';
import { ArbeidsukeFieldName } from '../types/Arbeidsuke';
import ArbeidstidInput from './ArbeidstidInput';
import { arbeidsperiodeErKortereEnnSøknadsperiode, getArbeidsukerIPerioden } from '../utils/arbeidstidUtils';

dayjs.extend(weekOfYear);

export const getArbeidsukeKey = (week: WeekOfYearInfo): string => {
    return `${dateRangeToISODateRange(week.dateRange)}`;
};

const getArbeidsukeFieldName = (parentFieldName: string, week: WeekOfYearInfo): ArbeidsukeFieldName =>
    `${parentFieldName}.${ArbeidIPeriodeFormField.arbeidsuker}.${getArbeidsukeKey(week)}`;

interface Props {
    periode: DateRange;
    søknadsperiode: DateRange;
    parentFieldName: string;
    normalarbeidstid: NormalarbeidstidSøknadsdata;
    timerEllerProsent: TimerEllerProsent;
    arbeidIPeriode: ArbeidIPeriodeFormValues;
    intlValues: ArbeidIPeriodeIntlValues;
}

const ArbeidstidUkerSpørsmål: React.FunctionComponent<Props> = ({
    periode,
    søknadsperiode,
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

    return (
        <SøknadFormComponents.InputGroup
            name={`${parentFieldName}_ukerGroup` as any}
            data-testid="arbeidsuker"
            legend={intlHelper(
                intl,
                `arbeidIPeriode.ulikeUkerGruppe.${
                    timerEllerProsent === TimerEllerProsent.PROSENT ? 'prosent' : 'timer'
                }.spm`,
                { ...intlValues, timerNormaltString }
            )}
            description={
                arbeidsperiodeErKortereEnnSøknadsperiode(periode, søknadsperiode) ? (
                    <>
                        Arbeidsperioden {intlValues.hvor} er kortere enn søknadsperioden. Da trenger du kun oppgi
                        informasjon for ukene i dette tidsrommet ({dateFormatter.compact(periode.from)} til{' '}
                        {dateFormatter.compact(periode.to)}).
                    </>
                ) : undefined
            }>
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
