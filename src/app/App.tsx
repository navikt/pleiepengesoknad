import * as React from 'react';
import { render } from 'react-dom';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import './globalStyles.less';
import LoadingPage from './components/pages/loading-page/LoadingPage';
import { Søkerdata } from './types/Søkerdata';
import { getBarn } from './utils/apiHelper';

const root = document.getElementById('app');

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
            const response = await getBarn();
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
                        fornavn: 'Mr. Santa',
                        mellomnavn: 'Claus',
                        etternavn: 'Winter',
                        fodselsnummer: '12345123451',
                        relasjon: 'far'
                    },
                    {
                        fodselsdato: '1990-09-29',
                        fornavn: 'Ms. Santa',
                        mellomnavn: 'Claus',
                        etternavn: 'Winter',
                        fodselsnummer: '12345123452',
                        relasjon: 'mor'
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
