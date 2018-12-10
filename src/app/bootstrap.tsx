import * as React from 'react';
import { render } from 'react-dom';
import Pleiepengesøknad from './connected-components/Pleiepengesøknad';
import ApplicationWrapper from './ApplicationWrapper';
import './globalStyles.less';

const root = document.getElementById('app');

const App: React.FunctionComponent = () => (
    <ApplicationWrapper>
        <Pleiepengesøknad />
    </ApplicationWrapper>
);

render(<App />, root);
