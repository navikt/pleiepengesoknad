import * as React from 'react';
import { render } from 'react-dom';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import './globalStyles.less';
import { getEnvironmentVariable } from './utils/envHelper';
import axios from 'axios';
import LoadingPage from './components/pages/loading-page/LoadingPage';
import { Søkerdata } from './types/Søkerdata';

const root = document.getElementById('app');

const apiUrl = getEnvironmentVariable('API_URL');

interface State {
    isLoading: boolean;
    søkerdata?: Søkerdata;
}

class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
    }

    componentDidMount() {
        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const response = await axios.get(`${apiUrl}/barn`, { withCredentials: true });
            this.setState({ isLoading: false, søkerdata: response.data });
        } catch (response) {
            // temporarily commented out until API is available
            // if (isForbidden(response) || isUnauthorized(response)) {
            //     window.location = loginUrl;
            // }
            const mockedSøkerdata: Søkerdata = {
                barn: [
                    {
                        fodselsdato: '1990-09-29',
                        fornavn: 'Santa',
                        mellomnavn: 'Claus',
                        etternavn: 'Winter',
                        fodselsnummer: '123412345',
                        relasjon: 'far'
                    },
                    {
                        fodselsdato: '1990-09-29',
                        fornavn: 'Luke',
                        mellomnavn: 'Claus',
                        etternavn: 'Skywalker',
                        fodselsnummer: '1234126345',
                        relasjon: 'some relation'
                    }
                ]
            };
            this.setState({ isLoading: false, søkerdata: mockedSøkerdata });
        }
    }

    render() {
        const { isLoading, søkerdata } = this.state;
        return (
            <ApplicationWrapper søkerdata={søkerdata}>
                {isLoading === true ? <LoadingPage /> : <Pleiepengesøknad />}
            </ApplicationWrapper>
        );
    }
}

render(<App />, root);
