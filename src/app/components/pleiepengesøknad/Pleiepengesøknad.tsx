import * as React from 'react';
import { Route } from 'react-router-dom';
import WelcomingPageContainer from '../../redux/containers/pages/welcoming-page/WelcomingPageContainer';

class Pleiepengesøknad extends React.Component {
    render() {
        return <Route component={WelcomingPageContainer} />;
    }
}

export default Pleiepengesøknad;
