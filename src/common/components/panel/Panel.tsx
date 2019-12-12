import * as React from 'react';
import NFPanel, { PanelBaseProps as NFPanelBaseProps } from 'nav-frontend-paneler';
import './panel.less';

const Panel: React.FunctionComponent<NFPanelBaseProps> = (props) => <NFPanel {...props} />;

export default Panel;
