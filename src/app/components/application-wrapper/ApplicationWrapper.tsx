import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../redux/store';
import IntlProviderContainer from '../../redux/containers/intl-provider/IntlProviderContainer';

const ApplicationWrapper: React.FunctionComponent = ({ children }) => (
    <Provider store={store}>
        <IntlProviderContainer>
            <Router>{children}</Router>
        </IntlProviderContainer>
    </Provider>
);

export default ApplicationWrapper;
