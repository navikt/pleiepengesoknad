import * as React from 'react';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { Ansettelsesforhold, Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '../../utils/apiUtils';
import routeConfig from '../../config/routeConfig';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getSøker } from '../../api/api';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';

interface Props {
    contentLoadedRenderer: (søkerdata?: Søkerdata) => React.ReactNode;
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
            if (isFeatureEnabled(Feature.HENT_BARN_FEATURE)) {
                const [søkerResponse, barnResponse] = await Promise.all([getSøker(), getBarn()]);
                this.handleSøkerdataFetchSuccess(søkerResponse, barnResponse);
            } else {
                const søkerResponse = await getSøker();
                this.handleSøkerdataFetchSuccess(søkerResponse);
            }
        } catch (response) {
            this.handleSøkerdataFetchError(response);
        }
    }

    handleSøkerdataFetchSuccess(søkerResponse: AxiosResponse, barnResponse?: AxiosResponse) {
        this.updateSøkerdata(
            {
                person: søkerResponse.data,
                barn: barnResponse ? barnResponse.data.barn : undefined,
                setAnsettelsesforhold: this.updateAnsettelsesforhold,
                ansettelsesforhold: []
            },
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    window.location.assign(routeConfig.WELCOMING_PAGE_ROUTE);
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
        if (apiUtils.isForbidden(response) || apiUtils.isUnauthorized(response)) {
            navigateToLoginPage();
        } else if (!userIsCurrentlyOnErrorPage()) {
            window.location.assign(routeConfig.ERROR_PAGE_ROUTE);
        }
        // this timeout is set because if isLoading is updated in the state too soon,
        // the contentLoadedRenderer() will be called while the user is still on the wrong route,
        // because the redirect to routeConfig.ERROR_PAGE_ROUTE will not have happened yet.
        setTimeout(this.stopLoading, 200);
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

        return (
            <SøkerdataContextProvider value={søkerdata}>{contentLoadedRenderer(søkerdata)}</SøkerdataContextProvider>
        );
    }
}

export default AppEssentialsLoader;
