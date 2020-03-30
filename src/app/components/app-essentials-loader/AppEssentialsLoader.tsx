import * as React from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { Attachment } from 'common/types/Attachment';
import { getBarn, getSøker, rehydrate } from '../../api/api';
import routeConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import demoSøkerdata from '../../demo/demoData';
import {
    AppFormField, initialValues, PleiepengesøknadFormData
} from '../../types/PleiepengesøknadFormData';
import { MELLOMLAGRING_VERSION, MellomlagringData } from '../../types/storage';
import { Arbeidsgiver, Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '../../utils/apiUtils';
import { appIsRunningInDemoMode } from '../../utils/envUtils';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import LoadingPage from '../pages/loading-page/LoadingPage';

export const VERIFY_MELLOMLAGRING_VERSION = false;

interface Props {
    contentLoadedRenderer: (
        formdata: PleiepengesøknadFormData,
        lastStepID?: StepID,
        søkerdata?: Søkerdata
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    lastStepID?: StepID;
    formdata: PleiepengesøknadFormData;
    søkerdata?: Søkerdata;
}

const getValidAttachments = (attachments: Attachment[] = []): Attachment[] => {
    return attachments.filter((a) => {
        return a.file?.name !== undefined;
    });
};

class AppEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            lastStepID: undefined,
            formdata: initialValues
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
            const [mellomlagringResponse, søkerResponse, barnResponse] = await Promise.all([
                rehydrate(),
                getSøker(),
                getBarn()
            ]);
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

    getValidMellomlagring = (data?: MellomlagringData): MellomlagringData | undefined => {
        if (VERIFY_MELLOMLAGRING_VERSION) {
            if (data?.metadata?.version === MELLOMLAGRING_VERSION) {
                return data;
            }
            return undefined;
        }
        return data;
    };

    handleSøkerdataFetchSuccess(
        mellomlagringResponse: AxiosResponse,
        søkerResponse: AxiosResponse,
        barnResponse?: AxiosResponse
    ) {
        const mellomlagring = this.getValidMellomlagring(mellomlagringResponse?.data);
        const formData = mellomlagring?.formData
            ? {
                  ...mellomlagring.formData,
                  [AppFormField.legeerklæring]: getValidAttachments(mellomlagring.formData.legeerklæring)
              }
            : undefined;
        const lastStepID = mellomlagring?.metadata?.lastStepID;
        this.updateSøkerdata(
            formData || { ...initialValues },
            {
                person: søkerResponse.data,
                barn: barnResponse ? barnResponse.data.barn : undefined,
                setArbeidsgivere: this.updateArbeidsgivere,
                arbeidsgivere: []
            },
            lastStepID,
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    window.location.assign(routeConfig.WELCOMING_PAGE_ROUTE);
                }
            }
        );
    }

    updateSøkerdata(
        formdata: PleiepengesøknadFormData,
        søkerdata: Søkerdata,
        lastStepID?: StepID,
        callback?: () => void
    ) {
        this.setState(
            {
                isLoading: false,
                lastStepID: lastStepID || this.state.lastStepID,
                formdata: formdata || this.state.formdata,
                søkerdata: søkerdata || this.state.søkerdata
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
        const { isLoading, lastStepID, formdata, søkerdata } = this.state;
        if (isLoading) {
            return <LoadingPage />;
        }
        return (
            <>
                <SøkerdataContextProvider value={søkerdata}>
                    {contentLoadedRenderer(formdata, lastStepID, søkerdata)}
                </SøkerdataContextProvider>
            </>
        );
    }
}

export default AppEssentialsLoader;
