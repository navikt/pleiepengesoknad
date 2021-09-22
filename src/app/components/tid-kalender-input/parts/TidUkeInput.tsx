import React from 'react';
import { FormattedMessage } from 'react-intl';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikTimeInput } from '@navikt/sif-common-formik';
import { Undertittel } from 'nav-frontend-typografi';
import { Daginfo, Ukeinfo } from '../../omsorgstilbud/types';
import { getForegåendeDagerIUke } from '../utils';
import { ValidationError, ValidationFunction } from '@navikt/sif-common-formik/lib/validation/types';

export type OmsorgstilbudUkeTittelRenderer = (ukeinfo: Ukeinfo) => React.ReactNode;

type DagLabelRenderer = (dag: Daginfo) => React.ReactNode;

interface Props {
    getFieldName: (dag: Daginfo) => string;
    ukeinfo: Ukeinfo;
    isNarrow: boolean;
    isWide: boolean;
    tidPerDagValidator?: (dag: string) => ValidationFunction<ValidationError>;
    tittelRenderer?: OmsorgstilbudUkeTittelRenderer;
    dagLabelRenderer?: (dag: Daginfo) => React.ReactNode;
}

const renderDagLabel = (dag: Daginfo, customRenderer?: DagLabelRenderer): JSX.Element => {
    return (
        <span className={bem.element('dag__label')}>
            {customRenderer ? (
                customRenderer(dag)
            ) : (
                <>
                    <span className={bem.element('dag__label__dagnavn')}>{dag.labelDag}</span>
                    <span className={bem.element('dag__label__dato')}>{dag.labelDato}</span>
                </>
            )}
        </span>
    );
};

const bem = bemUtils('omsorgstilbudForm');

const TidUkeInput: React.FunctionComponent<Props> = ({
    ukeinfo,
    getFieldName,
    tittelRenderer,
    dagLabelRenderer,
    tidPerDagValidator,
    isWide,
}) => {
    const { dager, ukenummer, år } = ukeinfo;
    return (
        <ResponsivePanel className={bem.element('uke')}>
            {tittelRenderer ? (
                tittelRenderer(ukeinfo)
            ) : (
                <Undertittel tag="h3">
                    <FormattedMessage
                        id="omsorgstilbud.ukeForm.tittel"
                        values={{
                            uke: ukenummer,
                            år,
                        }}
                    />
                </Undertittel>
            )}
            <div className={bem.element('uke__ukedager', isWide ? 'grid' : 'liste')}>
                {getForegåendeDagerIUke(dager[0]).map((dag) => (
                    <div
                        className={bem.element('dag', 'utenforPeriode')}
                        key={dag.isoDateString}
                        role="presentation"
                        aria-hidden={true}>
                        {renderDagLabel(dag, dagLabelRenderer)}
                        <div className={bem.element('dag__utenforPeriodeIkon')}>-</div>
                    </div>
                ))}
                {dager.map((dag) => (
                    <div key={dag.isoDateString} className={bem.element('dag')}>
                        <FormikTimeInput
                            name={getFieldName(dag)}
                            label={renderDagLabel(dag, dagLabelRenderer)}
                            timeInputLayout={{
                                direction: 'horizontal',
                            }}
                            validate={tidPerDagValidator ? tidPerDagValidator(dag.labelDato) : undefined}
                        />
                    </div>
                ))}
            </div>
        </ResponsivePanel>
    );
};

export default TidUkeInput;
