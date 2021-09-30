import React from 'react';
import { useMediaQuery } from 'react-responsive';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-formik';
import { TidPerDagValidator } from '../../validation/fieldValidations';
import TidUkeInput from './parts/TidUkeInput';
import { Ukeinfo } from './types';
import { getDatoerIPeriode, getTidKalenderFieldName, getUkerFraDager } from './utils';
import './tidUkerInput.less';

interface Props {
    fieldName: string;
    periode: DateRange;
    brukPanel?: boolean;
    ukeTittelRenderer?: (uke: Ukeinfo) => React.ReactNode;
    tidPerDagValidator?: TidPerDagValidator;
}

const bem = bemUtils('tidUkerInput');

export const TidUkerInput: React.FunctionComponent<Props> = ({
    fieldName,
    periode,
    brukPanel,
    ukeTittelRenderer,
    tidPerDagValidator,
}) => {
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const datoer = getDatoerIPeriode(periode.from, periode.to);
    const uker = getUkerFraDager(datoer);

    return (
        <div className={bem.classNames(bem.block, bem.modifier('inlineForm'))}>
            {uker.map((week) => {
                const content = (
                    <TidUkeInput
                        ukeTittelRenderer={ukeTittelRenderer}
                        getFieldName={(dag) => getTidKalenderFieldName(fieldName, dag)}
                        ukeinfo={week}
                        isNarrow={isNarrow}
                        isWide={isWide}
                        tidPerDagValidator={tidPerDagValidator}
                    />
                );
                return (
                    <div key={week.ukenummer} className={bem.element('ukeWrapper')}>
                        {brukPanel ? <ResponsivePanel>{content}</ResponsivePanel> : content}
                    </div>
                );
            })}
        </div>
    );
};

export default TidUkerInput;
