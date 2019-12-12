import * as React from 'react';
import { default as NFCounsellorPanel, VeilederpanelProps } from 'nav-frontend-veilederpanel';
import Counsellor from '../counsellor/Counsellor';
import './counsellorPanel.less';

type Props = Pick<VeilederpanelProps, 'kompakt' | 'type' | 'fargetema'>;

const CounsellorPanel: React.FunctionComponent<Props> = ({ children, kompakt = true, type = 'normal' }) => (
    <NFCounsellorPanel type={type} kompakt={kompakt} children={children} svg={<Counsellor theme="light" />} />
);

export default CounsellorPanel;
