import React from 'react';
import './demoModeInfo.less';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { FormattedHTMLMessage } from 'react-intl';

const DemoModeInfo: React.FunctionComponent<{}> = () => (
    <div className="demoModeInfoWrapper">
        <AlertStripeAdvarsel>
            <FormattedHTMLMessage id="demoInfo.html" />
        </AlertStripeAdvarsel>
    </div>
);

export default DemoModeInfo;
