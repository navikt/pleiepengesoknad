import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import React from 'react';

interface Props {
    usePanelLayout: boolean;
}

const ConditionalResponsivePanel: React.FunctionComponent<Props> = ({ usePanelLayout, children }) => {
    return usePanelLayout ? <ResponsivePanel>{children}</ResponsivePanel> : <>{children}</>;
};

export default ConditionalResponsivePanel;
