import * as React from 'react';
import { default as NFCounsellorPanel } from 'nav-frontend-veilederpanel';
import Counsellor from '../counsellor/Counsellor';
import './counsellorPanel.less';

const CounsellorPanel: React.FunctionComponent = ({ children }) => (
    <NFCounsellorPanel kompakt={true} children={children} svg={<Counsellor theme="light" />} />
);

export default CounsellorPanel;
