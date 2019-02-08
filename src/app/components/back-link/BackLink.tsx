import * as React from 'react';
import Chevron from 'nav-frontend-chevron';
import Lenke from 'nav-frontend-lenker';
import bemUtils from '../../utils/bemUtils';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import './backLink.less';

interface BackLinkProps {
    className?: string;
    href: string;
}

const bem = bemUtils('backLink');
const BackLink: React.FunctionComponent<BackLinkProps & RouteComponentProps> = ({ className, href, history }) => (
    <div className={`${bem.className} ${className}`}>
        <Chevron className={bem.element('chevron')} type="venstre" />
        <Lenke
            className={bem.element('link')}
            href={href}
            onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();
                history.push(href);
            }}>
            Tilbake
        </Lenke>
    </div>
);

export default withRouter(BackLink);
