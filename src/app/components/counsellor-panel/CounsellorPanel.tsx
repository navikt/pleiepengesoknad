import * as React from 'react';
import { default as NFCounsellorPanel } from 'nav-frontend-veilederpanel';
import Counsellor from '../counsellor/Counsellor';
import './counsellorPanel.less';

const CounsellorPanel: React.FunctionComponent = ({ children }) => (
    <NFCounsellorPanel children={children} svg={<Counsellor />} />
);

export default CounsellorPanel;
