import { Panel, PanelProps } from '@navikt/ds-react';
import React from 'react';
import bemUtils from '@navikt/sif-common-core-ds/lib/utils/bemUtils';
import './responsivePanel.less';

const bem = bemUtils('responsivePanel');

const ResponsivePanel = ({ className, ...rest }: PanelProps) => (
    <Panel className={bem.classNames(bem.block, className)} {...rest} />
);

export default ResponsivePanel;
