import * as React from 'react';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { Arbeidsgiver, Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '../../utils/apiUtils';
import routeConfig from '../../config/routeConfig';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getSøker, rehydrate } from '../../api/api';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import demoSøkerdata from '../../demo/demoData';
import { appIsRunningInDemoMode } from '../../utils/envUtils';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

interface Props {
    contentLoadedRenderer: (mellomlagring: PleiepengesøknadFormData, søkerdata?: Søkerdata) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    mellomlagring: PleiepengesøknadFormData;
    søkerdata?: Søkerdata;
}

class AppEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            mellomlagring: initialValues,
        };

        this.updateArbeidsgivere = this.updateArbeidsgivere.bind(this);
        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);
        this.initDemoMode = this.initDemoMode.bind(this);

        if (appIsRunningInDemoMode()) {
            setTimeout(this.initDemoMode, 1000);
        } else {
            this.loadAppEssentials();
        }
    }

    async loadAppEssentials() {
        try {
            const [mellomlagringResponse, søkerResponse, barnResponse] = await Promise.all([rehydrate(), getSøker(), getBarn()]);
            this.handleSøkerdataFetchSuccess(mellomlagringResponse, søkerResponse, barnResponse);
        } catch (response) {
            this.handleSøkerdataFetchError(response);
        }
    }

    initDemoMode() {
        this.setState({
            isLoading: false,
            søkerdata: {
                ...(demoSøkerdata as Søkerdata),
                setArbeidsgivere: this.updateArbeidsgivere
            }
        });
        this.stopLoading();
    }

    handleSøkerdataFetchSuccess(mellomlagringResponse:  AxiosResponse, søkerResponse: AxiosResponse, barnResponse?: AxiosResponse) {
        const mellomlagring = mellomlagringResponse && mellomlagringResponse.data ? { ...initialValues, ...mellomlagringResponse.data } : initialValues;
        this.updateSøkerdata(
            mellomlagring,
            {
                person: søkerResponse.data,
                barn: barnResponse ? barnResponse.data.barn : undefined,
                setArbeidsgivere: this.updateArbeidsgivere,
                arbeidsgivere: []
            },
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    window.location.assign(routeConfig.WELCOMING_PAGE_ROUTE);
                }
            }
        );
    }


    updateSøkerdata(mellomlagring: PleiepengesøknadFormData,søkerdata: Søkerdata, callback?: () => void) {
        this.setState(
            {
                isLoading: false,
                mellomlagring: mellomlagring ? mellomlagring : this.state.mellomlagring,
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

    updateArbeidsgivere(arbeidsgivere: Arbeidsgiver[]) {
        const { barn, person, setArbeidsgivere } = this.state.søkerdata!;
        this.setState({
            søkerdata: {
                barn,
                setArbeidsgivere,
                arbeidsgivere,
                person
            }
        });
    }

    render() {
        const { contentLoadedRenderer } = this.props;
        const { isLoading, søkerdata, mellomlagring } = this.state;
        if (isLoading) {
            return <LoadingPage />;
        }
        return (
            <>
                <SøkerdataContextProvider value={søkerdata}>
                    {contentLoadedRenderer(mellomlagring, søkerdata)}
                </SøkerdataContextProvider>
            </>
        );
    }
}

export default AppEssentialsLoader;
