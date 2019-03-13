import * as React from 'react';
import bemUtils from '../../utils/bemUtils';
import './informationPanel.less';

const bem = bemUtils('informationPanel');
const InformationPanel: React.FunctionComponent = ({ children }) => <div className={bem.className}>{children}</div>;

export default InformationPanel;
