import React from 'react';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-formik';
import { tidUkerInputUtils } from '@navikt/sif-common-pleiepenger/lib/tid-kalender-form/tid-uker-input/tidUkerUtils';
import { Daginfo, Ukeinfo } from '@navikt/sif-common-pleiepenger/lib/types/tidUkerTypes';
import { isDateInDates, Weekday } from '@navikt/sif-common-utils/lib';
import ArbeidstidUkeInput, { ArbeidstidUkeInputEnkeltdagValidator, ArbeidstidUkeTekster } from './ArbeidstidUkeInput';
import './arbeidstidUkerInput.less';

const getTidKalenderFieldName = (fieldName: string, dag: Daginfo): string => `${fieldName}.${dag.isoDate}`;

interface Props {
    fieldName: string;
    periode: DateRange;
    brukPanel?: boolean;
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
    brukPanel,
    utilgjengeligeDatoer,
    utilgjengeligeUkedager,
    ukeTittelRenderer,
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
        <div className={bem.classNames(bem.block, bem.modifier('inlineForm'))}>
            {uker.map((uke) => {
                const content = (
                    <ArbeidstidUkeInput
                        ukeTittelRenderer={ukeTittelRenderer}
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
                );
                return (
                    <div key={uke.ukenummer} className={bem.element('ukeWrapper')}>
                        {brukPanel ? <ResponsivePanel>{content}</ResponsivePanel> : content}
                    </div>
                );
            })}
        </div>
    );
};

export default ArbeidstidUkerInput;
