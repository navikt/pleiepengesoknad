import * as React from 'react';
import { render } from 'react-dom';
import Pleiepengesøknad from './components/pleiepengesøknad/Pleiepengesøknad';
import ApplicationWrapper from './components/application-wrapper/ApplicationWrapper';
import LoadingPage from './components/pages/loading-page/LoadingPage';
import { Søkerdata } from './types/Søkerdata';
import { getAnsettelsesforhold, getBarn, isForbidden, isUnauthorized } from './utils/apiHelper';
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
    }

    componentDidMount() {
        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const [barnResponse, ansettelsesforholdResponse] = await Promise.all([getBarn(), getAnsettelsesforhold()]);
            this.setState({
                isLoading: false,
                søkerdata: {
                    barn: barnResponse.data.barn,
                    ansettelsesforhold: ansettelsesforholdResponse.data.organisasjoner
                }
            });
        } catch (response) {
            if (isForbidden(response) || isUnauthorized(response)) {
                window.location = loginUrl;
            }
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
