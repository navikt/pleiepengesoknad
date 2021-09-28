import React from 'react';
import { FormattedMessage } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikTimeInput } from '@navikt/sif-common-formik';
import { Element } from 'nav-frontend-typografi';
import { Daginfo, Ukeinfo } from '../types';
import { getForegåendeDagerIUke } from '../utils';
import { TidPerDagValidator } from '../../../validation/fieldValidations';

type DagLabelRenderer = (dag: Daginfo) => React.ReactNode;

interface Props {
    getFieldName: (dag: Daginfo) => string;
    ukeinfo: Ukeinfo;
    isNarrow: boolean;
    isWide: boolean;
    tidPerDagValidator?: TidPerDagValidator;
    ukeTittelRenderer?: (uke: Ukeinfo) => React.ReactNode;
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

const bem = bemUtils('tidUkerInput');

const TidUkeInput: React.FunctionComponent<Props> = ({
    ukeinfo,
    getFieldName,
    dagLabelRenderer,
    tidPerDagValidator,
    ukeTittelRenderer,
    isWide,
}) => {
    const { dager } = ukeinfo;
    return (
        <div className={bem.element('uke')}>
            {ukeTittelRenderer ? (
                ukeTittelRenderer(ukeinfo)
            ) : (
                <Element tag="h3">
                    <FormattedMessage id="ukeÅr" values={{ ...ukeinfo }} />
                </Element>
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
                            validate={tidPerDagValidator ? tidPerDagValidator(dag.labelFull) : undefined}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TidUkeInput;
