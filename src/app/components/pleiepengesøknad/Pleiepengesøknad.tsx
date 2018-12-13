import * as React from 'react';
import { Route } from 'react-router-dom';
import WelcomingPage from '../pages/welcoming-page/WelcomingPage';

class Pleiepengesøknad extends React.Component {
    render() {
        return <Route component={WelcomingPage} />;
    }
}

export default Pleiepengesøknad;
