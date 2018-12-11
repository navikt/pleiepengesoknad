import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import IntlProvider from './connected-components/intl-provider/IntlProvider';

const ApplicationWrapper: React.FunctionComponent = ({ children }) => (
    <Provider store={store}>
        <IntlProvider>
            <Router>{children}</Router>
        </IntlProvider>
    </Provider>
);

export default ApplicationWrapper;
