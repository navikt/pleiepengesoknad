import React from 'react';
import { useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

const EksempelOmsorgstilbud: React.FunctionComponent = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'steg.omsorgstilbud.eksempel.tittel')}>
            <p>{intlHelper(intl, 'steg.omsorgstilbud.eksempel.1')}</p>
            <p>{intlHelper(intl, 'steg.omsorgstilbud.eksempel.2')}</p>
        </ExpandableInfo>
    );
};

export default EksempelOmsorgstilbud;
