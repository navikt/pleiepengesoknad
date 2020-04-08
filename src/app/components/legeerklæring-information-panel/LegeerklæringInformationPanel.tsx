import * as React from 'react';
import LegeerklæringIcon from '../legeerklæring-icon/LegeerklæringWithArmIcon';
import Veilederpanel from 'nav-frontend-veilederpanel';
import './legeerklæringInformationPanel.less';

interface LegeerklæringInformationPanelProps {
    children: React.ReactNode;
}

const LegeerklæringInformationPanel: React.FunctionComponent<LegeerklæringInformationPanelProps> = ({ children }) => (
    <Veilederpanel svg={<LegeerklæringIcon />} kompakt={true}>
        {children}
    </Veilederpanel>
);

export default LegeerklæringInformationPanel;
