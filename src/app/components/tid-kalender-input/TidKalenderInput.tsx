import React from 'react';
import { useMediaQuery } from 'react-responsive';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-formik';
import TidUkeInput from './parts/TidUkeInput';
import { Ukeinfo } from './types';
import { getDatoerIPeriode, getTidKalenderFieldName, getUkerFraDager } from './utils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';

interface Props {
    fieldName: string;
    periode: DateRange;
    ukeTittelRenderer?: (ukeinfo: Ukeinfo) => React.ReactNode;
    tidPerDagValidator?: (dag: string) => ValidationFunction<ValidationError>;
}

const bem = bemUtils('omsorgstilbudForm');

export const TidKalenderInput: React.FunctionComponent<Props> = ({
    fieldName,
    periode,
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
                return (
                    <FormBlock key={week.ukenummer} margin="m">
                        <TidUkeInput
                            getFieldName={(dag) => getTidKalenderFieldName(fieldName, dag)}
                            ukeinfo={week}
                            isNarrow={isNarrow}
                            isWide={isWide}
                            tittelRenderer={ukeTittelRenderer}
                            tidPerDagValidator={tidPerDagValidator}
                        />
                    </FormBlock>
                );
            })}
        </div>
    );
};

export default TidKalenderInput;
