import React from 'react';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues, formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';
import {
    dateRangeToISODateRange,
    decimalDurationToDuration,
    getWeeksInDateRange,
    ISODateRange,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import SøknadFormComponents from '../../../SøknadFormComponents';
import ArbeidstidInput from './ArbeidstidInput';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';

dayjs.extend(weekOfYear);

export interface Arbeidsuke {
    ukeKey: string; // År + uke
    fieldname: string; // FormikFieldName
    ukenummer: number;
    periode: DateRange;
    isoDateRange: ISODateRange;
}

const getUkerIPeriode = (parentFieldName: string, periode: DateRange): Arbeidsuke[] => {
    const arbeidsuker: Arbeidsuke[] = [];

    getWeeksInDateRange(periode).forEach((week) => {
        const ukeKey = `${week.from.getFullYear()}_${dayjs(week.from).week()}`;
        arbeidsuker.push({
            ukeKey,
            fieldname: `${parentFieldName}.${ArbeidIPeriodeFormField.arbeidsuker}.${ukeKey}`,
            ukenummer: dayjs(week.from).week(),
            isoDateRange: dateRangeToISODateRange(week),
            periode: week,
        });
    });
    return arbeidsuker;
};

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
    const arbeidsuker = getUkerIPeriode(parentFieldName, periode);
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
                    <div key={dateRangeToISODateRange(arbeidsuke.periode)}>
                        <ArbeidstidInput
                            arbeidsuke={arbeidsuke}
                            parentFieldName={arbeidsuke.fieldname}
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
