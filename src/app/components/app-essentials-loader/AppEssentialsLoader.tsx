import * as React from 'react';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { Ansettelsesforhold, Søkerdata } from '../../types/Søkerdata';
import { isForbidden, isUnauthorized } from '../../utils/apiUtils';
import { getEnvironmentVariable } from '../../utils/envUtils';
import routeConfig from '../../config/routeConfig';
import { userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getSøker } from '../../api/api';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';

const loginUrl = getEnvironmentVariable('LOGIN_URL');

interface Props {
    contentLoadedRenderer: () => React.ReactNode;
}

interface State {
    isLoading: boolean;
    søkerdata?: Søkerdata;
}

class AppEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { isLoading: true };

        this.updateAnsettelsesforhold = this.updateAnsettelsesforhold.bind(this);
        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);

        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const [barnResponse, søkerResponse] = await Promise.all([getBarn(), getSøker()]);
            this.handleSøkerdataFetchSuccess(barnResponse, søkerResponse);
        } catch (response) {
            this.handleSøkerdataFetchError(response);
        }
    }

    handleSøkerdataFetchSuccess(barnResponse: AxiosResponse, søkerResponse: AxiosResponse) {
        this.updateSøkerdata(
            {
                person: søkerResponse.data,
                barn: barnResponse.data.barn,
                setAnsettelsesforhold: this.updateAnsettelsesforhold
            },
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    window.location.href = routeConfig.WELCOMING_PAGE_ROUTE;
                }
            }
        );
    }

    updateSøkerdata(søkerdata: Søkerdata, callback?: () => void) {
        this.setState(
            {
                isLoading: false,
                søkerdata: søkerdata ? søkerdata : this.state.søkerdata
            },
            callback
        );
    }

    stopLoading() {
        this.setState({
            isLoading: false
        });
    }

    handleSøkerdataFetchError(response: AxiosError) {
        if (isForbidden(response) || isUnauthorized(response)) {
            window.location = loginUrl;
        } else if (!userIsCurrentlyOnErrorPage()) {
            window.location.href = routeConfig.ERROR_PAGE_ROUTE;
        }
        this.stopLoading();
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
        const { contentLoadedRenderer } = this.props;
        const { isLoading, søkerdata } = this.state;

        if (isLoading) {
            return <LoadingPage />;
        }

        return <SøkerdataContextProvider value={søkerdata}>{contentLoadedRenderer()}</SøkerdataContextProvider>;
    }
}

export default AppEssentialsLoader;
