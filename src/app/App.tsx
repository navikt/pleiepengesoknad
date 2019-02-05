import * as React from 'react';
import { render } from 'react-dom';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import LoadingPage from './components/pages/loading-page/LoadingPage';
import { Ansettelsesforhold, Søkerdata } from './types/Søkerdata';
import { getBarn, getSøker, isForbidden, isUnauthorized } from './utils/apiHelper';
import { getEnvironmentVariable } from './utils/envHelper';
import './globalStyles.less';

const root = document.getElementById('app');
const loginUrl = getEnvironmentVariable('LOGIN_URL');

interface State {
    isLoading: boolean;
    søkerdata?: Søkerdata;
}

class App extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = { isLoading: true };
        this.updateAnsettelsesforhold = this.updateAnsettelsesforhold.bind(this);
    }

    componentDidMount() {
        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const [barnResponse, søkerResponse] = await Promise.all([getBarn(), getSøker()]);
            this.setState({
                isLoading: false,
                søkerdata: {
                    person: søkerResponse.data,
                    barn: barnResponse.data.barn,
                    setAnsettelsesforhold: this.updateAnsettelsesforhold
                }
            });
        } catch (response) {
            if (isForbidden(response) || isUnauthorized(response)) {
                window.location = loginUrl;
            } else {
                window.location.href = '/feil';
            }
        }
    }

    updateAnsettelsesforhold(ansettelsesforhold: Ansettelsesforhold[]) {
        const { barn, person, setAnsettelsesforhold } = this.state.søkerdata!;
        this.setState({
            søkerdata: {
                barn,
                setAnsettelsesforhold,
                ansettelsesforhold,
                person
            }
        });
    }

    render() {
        const { isLoading, søkerdata } = this.state;

        if (isLoading) {
            return <LoadingPage />;
        }

        return (
            <ApplicationWrapper søkerdata={søkerdata}>
                <Pleiepengesøknad />
            </ApplicationWrapper>
        );
    }
}

render(<App />, root);
