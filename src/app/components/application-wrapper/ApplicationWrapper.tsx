import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import IntlProvider from '../intl-provider/IntlProvider';
import { Søkerdata } from '../../types/Søkerdata';

interface ApplicationWrapperProps {
    søkerdata?: Søkerdata;
}

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({ søkerdata, children }) => {
    return (
        <IntlProvider locale="nb">
            <Router>{children}</Router>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
