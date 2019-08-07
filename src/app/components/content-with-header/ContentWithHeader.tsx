import * as React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import bemHelper from '../../utils/bemUtils';
import './contentWithHeader.less';

interface ContentWithHeaderProps {
    header: string;
    children: React.ReactElement<any> | Array<React.ReactElement<any>> | React.ReactNode;
}

const bem = bemHelper('contentWithHeader');
const ContentWithHeader: React.FunctionComponent<ContentWithHeaderProps> = ({ header, children }) => {
    return (
        <div className={bem.block}>
            <Normaltekst className={bem.element('header')}>{header}</Normaltekst>
            {children}
        </div>
    );
};

export default ContentWithHeader;
