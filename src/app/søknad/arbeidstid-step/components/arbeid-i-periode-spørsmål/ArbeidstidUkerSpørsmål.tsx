import React from 'react';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { dateRangeToISODateRange, getWeeksInDateRange, ISODateRange } from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import SøknadFormComponents from '../../../SøknadFormComponents';
import { ArbeidIPeriodeFormField } from '../../../../types/ArbeidIPeriodeFormValues';

dayjs.extend(weekOfYear);

interface Arbeidsuke {
    ukenummer: number;
    periode: DateRange;
    isoDateRange: ISODateRange;
    timer?: string;
    prosent?: string;
}

const getUkerIPeriode = (periode: DateRange): Arbeidsuke[] => {
    const arbeidsuker: Arbeidsuke[] = [];
    getWeeksInDateRange(periode).forEach((week) => {
        arbeidsuker.push({
            ukenummer: dayjs(week.from).week(),
            isoDateRange: dateRangeToISODateRange(week),
            periode: week,
            prosent: undefined,
            timer: undefined,
        });
    });
    return arbeidsuker;
};

interface Props {
    periode: DateRange;
    parentFieldName: string;
}

const ArbeidstidUkerSpørsmål: React.FunctionComponent<Props> = ({ periode, parentFieldName }) => {
    const arbeidsuker = getUkerIPeriode(periode);

    const getFieldName = (arbeidsuke: Arbeidsuke): string =>
        `${parentFieldName}.${ArbeidIPeriodeFormField.arbeidsuker}.${arbeidsuke.periode.from.getFullYear()}_${
            arbeidsuke.ukenummer
        }`;

    return (
        <SøknadFormComponents.InputGroup
            name={`${parentFieldName}_ukerGroup` as any}
            legend="Oppgi hvor mye du jobber de ulike ukene i perioden">
            {arbeidsuker.map((arbeidsuke) => {
                const fieldName = getFieldName(arbeidsuke) as any;
                return (
                    <div key={dateRangeToISODateRange(arbeidsuke.periode)}>
                        <SøknadFormComponents.NumberInput
                            label={`Uke ${arbeidsuke.ukenummer} - ${arbeidsuke.periode.from.getFullYear()}`}
                            name={fieldName}
                        />
                    </div>
                );
            })}
        </SøknadFormComponents.InputGroup>
    );
};

export default ArbeidstidUkerSpørsmål;
