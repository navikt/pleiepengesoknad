import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import routeConfig from '../../config/routeConfig';

export default () => (
    <Lenke href={routeConfig.WELCOMING_PAGE_ROUTE}>
        <FormattedMessage id="gotoApplicationLink.lenketekst" />
    </Lenke>
);
