import React from 'react';
import { FormattedMessage } from 'react-intl';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikTimeInput } from '@navikt/sif-common-formik';
import { Undertittel } from 'nav-frontend-typografi';
import { Daginfo, Ukeinfo } from '../types';
import formUtils from './omsorgstilbudFormUtils';

export type OmsorgstilbudUkeTittelRenderer = (ukeinfo: Ukeinfo) => React.ReactNode;

type DagLabelRenderer = (dag: Daginfo) => React.ReactNode;

interface OmsorgstilbudUkeFormProps {
    getFieldName: (dag: Daginfo) => string;
    ukeinfo: Ukeinfo;
    isNarrow: boolean;
    isWide: boolean;
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

const OmsorgstilbudUkeForm: React.FunctionComponent<OmsorgstilbudUkeFormProps> = ({
    ukeinfo,
    getFieldName,
    tittelRenderer,
    dagLabelRenderer,
    isNarrow,
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
                {formUtils.getForegåendeDagerIUke(dager[0]).map((dag) => (
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
                            timeInputLayout={formUtils.getTimeInputLayout(isNarrow, isWide)}
                            validate={formUtils.getTidIOmsorgValidator(dag)}
                        />
                    </div>
                ))}
            </div>
        </ResponsivePanel>
    );
};

export default OmsorgstilbudUkeForm;
