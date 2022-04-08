import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-formik';
import { tidUkerInputUtils } from '@navikt/sif-common-pleiepenger/lib/tid-kalender-form/tid-uker-input/tidUkerUtils';
import { Daginfo, Ukeinfo } from '@navikt/sif-common-pleiepenger/lib/types/tidUkerTypes';
import { isDateInDates, Weekday } from '@navikt/sif-common-utils/lib';
import ArbeidstidUkeInput, {
    ArbeidstidUkeInputEnkeltdagValidator,
    ArbeidstidUkeTekster,
} from '../arbeidstid-uke-input/ArbeidstidUkeInput';
import './arbeidstidUkerInput.less';

const getTidKalenderFieldName = (fieldName: string, dag: Daginfo): string => `${fieldName}.${dag.isoDate}`;

interface Props {
    fieldName: string;
    periode: DateRange;
    utilgjengeligeDatoer?: Date[];
    utilgjengeligeUkedager?: Weekday[];
    tekster: ArbeidstidUkeTekster;
    ukeTittelRenderer?: (uke: Ukeinfo) => React.ReactNode;
    enkeltdagValidator?: ArbeidstidUkeInputEnkeltdagValidator;
}

const bem = bemUtils('arbeidstidUkerInput');

export const ArbeidstidUkerInput: React.FunctionComponent<Props> = ({
    fieldName,
    periode,
    utilgjengeligeDatoer,
    utilgjengeligeUkedager,
    enkeltdagValidator,
}) => {
    const dager = tidUkerInputUtils.getDagInfoForPeriode(periode);
    const uker = tidUkerInputUtils
        .getUkerFraDager(dager)
        .filter(
            (uke) =>
                uke.dager.filter((dag) => isDateInDates(dag.dato, utilgjengeligeDatoer)).length !== uke.dager.length
        );

    return (
        <div className={bem.block}>
            {uker.map((uke) => {
                return (
                    <div key={uke.ukenummer} className={bem.element('ukeWrapper')}>
                        <ArbeidstidUkeInput
                            getFieldName={(dag) => getTidKalenderFieldName(fieldName, dag)}
                            ukeinfo={uke}
                            utilgjengeligeDatoer={utilgjengeligeDatoer}
                            utilgjengeligeUkedager={utilgjengeligeUkedager}
                            enkeltdagValidator={enkeltdagValidator}
                            tekst={{
                                dag: 'Dag',
                                jobber: 'Jobber timer',
                                ariaLabelTidInput: (dato) => `Hvor mye skal du jobbe ${dato}`,
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default ArbeidstidUkerInput;
