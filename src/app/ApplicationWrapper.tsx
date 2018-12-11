import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

const ApplicationWrapper: React.FunctionComponent = ({ children }) => (
    <Provider store={store}>
        <Router>{children}</Router>
    </Provider>
);

export default ApplicationWrapper;
