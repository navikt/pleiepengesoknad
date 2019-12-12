import * as React from 'react';
import { default as NFCounsellorPanel } from 'nav-frontend-veilederpanel';
import InformationIcon from '../information-icon/InformationIcon';
import bemUtils from 'common/utils/bemUtils';
import './informationPoster.less';

const bem = bemUtils('informationPoster');
const InformationPoster: React.FunctionComponent = ({ children }) => (
    <div className={bem.block}>
        <NFCounsellorPanel svg={<InformationIcon />} type="plakat" kompakt={true}>
            {children}
        </NFCounsellorPanel>
    </div>
);

export default InformationPoster;
