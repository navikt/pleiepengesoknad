import * as React from 'react';
import LegeerklæringIcon from '../legeerklæring-icon/LegeerklæringIcon';
import Veilederpanel from 'nav-frontend-veilederpanel';
import './legeerklæringInformation.less';

interface LegeerklæringInformationProps {
    text: string;
}

const LegeerklæringInformation: React.FunctionComponent<LegeerklæringInformationProps> = ({ text }) => (
    <Veilederpanel svg={<LegeerklæringIcon />} kompakt={true}>
        {text}
    </Veilederpanel>
);

export default LegeerklæringInformation;
