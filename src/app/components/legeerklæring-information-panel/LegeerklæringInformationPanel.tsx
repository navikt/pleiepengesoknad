import * as React from 'react';
import Veilederpanel from 'nav-frontend-veilederpanel';
import LegeerklæringIcon from '../legeerklæring-icon/LegeerklæringWithArmIcon';
import './legeerklæringInformationPanel.less';

interface LegeerklæringInformationPanelProps {
    children: React.ReactNode;
}

const LegeerklæringInformationPanel = ({ children }: LegeerklæringInformationPanelProps) => (
    <Veilederpanel svg={<LegeerklæringIcon />} kompakt={true}>
        {children}
    </Veilederpanel>
);

export default LegeerklæringInformationPanel;
