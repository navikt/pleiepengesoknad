import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import IntlProvider from '../intl-provider/IntlProvider';

const ApplicationWrapper: React.FunctionComponent = ({ children }) => (
    <IntlProvider locale="nb">
        <Router>{children}</Router>
    </IntlProvider>
);

export default ApplicationWrapper;
