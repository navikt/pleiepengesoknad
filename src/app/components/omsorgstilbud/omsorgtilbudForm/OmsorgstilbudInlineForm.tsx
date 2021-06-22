import React from 'react';
import { useMediaQuery } from 'react-responsive';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { DateRange } from '@navikt/sif-common-formik';
import formUtils from './omsorgstilbudFormUtils';
import OmsorgstilbudUkeForm, { OmsorgstilbudUkeTittelRenderer } from './OmsorgstilbudUkeForm';

interface OmsorgstilbudInlineFormProps {
    fieldName: string;
    søknadsperiode: DateRange;
    ukeTittelRenderer?: OmsorgstilbudUkeTittelRenderer;
}

const bem = bemUtils('omsorgstilbudForm');

export const OmsorgstilbudInlineForm: React.FunctionComponent<OmsorgstilbudInlineFormProps> = ({
    fieldName,
    søknadsperiode,
    ukeTittelRenderer,
}) => {
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const datoer = formUtils.getDatoerForOmsorgstilbudPeriode(søknadsperiode.from, søknadsperiode.to);
    const uker = formUtils.getUker(datoer);

    return (
        <div className={bem.classNames(bem.block, bem.modifier('inlineForm'))}>
            {uker.map((week) => {
                return (
                    <FormBlock key={week.ukenummer} margin="m">
                        <OmsorgstilbudUkeForm
                            getFieldName={(dag) => formUtils.getOmsorgstilbudTidFieldName(fieldName, dag)}
                            ukeinfo={week}
                            isNarrow={isNarrow}
                            isWide={isWide}
                            tittelRenderer={ukeTittelRenderer}
                        />
                    </FormBlock>
                );
            })}
        </div>
    );
};

export default OmsorgstilbudInlineForm;
