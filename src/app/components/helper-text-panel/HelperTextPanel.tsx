import * as React from 'react';
import bemUtils from '../../utils/bemUtils';
import './helperTextPanel.less';

const bem = bemUtils('helperTextPanel');
const HelperTextPanel: React.FunctionComponent = ({ children }) => <div className={bem.className}>{children}</div>;

export default HelperTextPanel;
