import * as React from 'react';
import { render } from 'react-dom';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import './globalStyles.less';

const root = document.getElementById('app');

const App: React.FunctionComponent = () => (
    <ApplicationWrapper>
        <Pleiepengesøknad />
    </ApplicationWrapper>
);

render(<App />, root);
