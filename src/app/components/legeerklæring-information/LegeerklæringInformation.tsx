import * as React from 'react';
import bemUtils from '../../utils/bemUtils';
import LegeerklæringIcon from '../legeerklæring-icon/LegeerklæringIcon';
import './legeerklæringInformation.less';

interface LegeerklæringInformationProps {
    text: string;
}

const bem = bemUtils('legeerklæringInformation');
const LegeerklæringInformation: React.FunctionComponent<LegeerklæringInformationProps> = ({ text }) => (
    <div className={bem.className}>
        <LegeerklæringIcon />
        <p className={bem.element('text')}>{text}</p>
    </div>
);

export default LegeerklæringInformation;
