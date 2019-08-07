import * as React from 'react';
import Chevron from 'nav-frontend-chevron';
import Lenke from 'nav-frontend-lenker';
import bemUtils from '../../utils/bemUtils';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { History } from 'history';
import './backLink.less';
import { FormattedMessage } from 'react-intl';

interface BackLinkProps {
    className?: string;
    href: string;
    onClick?: (href: string, history: History, event: React.SyntheticEvent) => void;
}

const bem = bemUtils('backLink');
const BackLink: React.FunctionComponent<BackLinkProps & RouteComponentProps> = ({
    className,
    href,
    history,
    onClick
}) => {
    const navigate = () => history.push(href);

    const handleOnClick = (event: React.SyntheticEvent) => {
        if (onClick) {
            onClick(href, history, event);
        } else {
            event.preventDefault();
            navigate();
        }
    };

    return (
        <div className={`${bem.block} ${className}`} onClick={handleOnClick}>
            <Chevron className={bem.element('chevron')} type="venstre" />
            <Lenke className={bem.element('link')} href={href}>
                <FormattedMessage id="backlink.label" />
            </Lenke>
        </div>
    );
};

export default withRouter(BackLink);
