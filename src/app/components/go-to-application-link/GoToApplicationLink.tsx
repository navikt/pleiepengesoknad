import * as React from 'react';
import Lenke from 'nav-frontend-lenker';
import routeConfig from '../../config/routeConfig';
import { FormattedMessage } from 'react-intl';

export default () => (
    <Lenke href={routeConfig.WELCOMING_PAGE_ROUTE}>
        <FormattedMessage id="gotoApplicationLink.lenketekst" />
    </Lenke>
);
