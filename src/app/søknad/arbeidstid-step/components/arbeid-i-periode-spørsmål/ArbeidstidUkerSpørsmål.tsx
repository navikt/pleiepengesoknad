import React from 'react';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { ArbeidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib';
import { dateRangeToISODateRange, getWeeksInDateRange, ISODateRange } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { TimerEllerProsent } from '../../../../types';
import { ArbeidIPeriodeFormField, ArbeidIPeriodeFormValues } from '../../../../types/ArbeidIPeriodeFormValues';
import { NormalarbeidstidSøknadsdata } from '../../../../types/søknadsdata/normalarbeidstidSøknadsdata';
import SøknadFormComponents from '../../../SøknadFormComponents';
import ArbeidstidInput from './ArbeidstidInput';

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

    return (
        <SøknadFormComponents.InputGroup
            name={`${parentFieldName}_ukerGroup` as any}
            legend="Oppgi hvor mye du jobber de ulike ukene i perioden">
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
                        {/* {timerEllerProsent === TimerEllerProsent.TIMER && (
                            <SøknadFormComponents.NumberInput
                                label={`Uke ${arbeidsuke.ukenummer} - ${arbeidsuke.periode.from.getFullYear()}`}
                                name={fieldName}
                                bredde="XS"
                                maxLength={4}
                                suffixStyle="text"
                                suffix={`timer av normalt ${formatTimerOgMinutter(
                                    intl,
                                    decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
                                )} i uken.`}
                            />
                        )}
                        {timerEllerProsent === TimerEllerProsent.PROSENT && (
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

                    <SøknadFormComponents.NumberInput
                                label={`Uke ${arbeidsuke.ukenummer} - ${arbeidsuke.periode.from.getFullYear()}`}
                                name={fieldName}
                                bredde="XS"
                                maxLength={4}
                                suffixStyle="text"
                                suffix={`timer av normalt ${formatTimerOgMinutter(
                                    intl,
                                    decimalDurationToDuration(normalarbeidstid.timerPerUkeISnitt)
                                )} i uken.`}
                            />
                        )} */}
                    </div>
                );
            })}
        </SøknadFormComponents.InputGroup>
    );
};

export default ArbeidstidUkerSpørsmål;
