import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import IntlProvider from '../intl-provider/IntlProvider';
import { Søkerdata } from '../../types/Søkerdata';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';

interface ApplicationWrapperProps {
    søkerdata?: Søkerdata;
}

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({ søkerdata, children }) => {
    return (
        <IntlProvider locale="nb">
            <SøkerdataContextProvider value={søkerdata}>
                <Router>{children}</Router>
            </SøkerdataContextProvider>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
