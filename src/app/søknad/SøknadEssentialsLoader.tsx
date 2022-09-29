import React from 'react';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import * as apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getSøker, purge, rehydrate } from '../api/api';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import demoMockData from '../demo-mock-data/DemoMockData';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormData, SøknadFormField } from '../types/SøknadFormData';
import { MELLOMLAGRING_VERSION, SøknadTempStorageData } from '../types/SøknadTempStorageData';
import appSentryLogger from '../utils/appSentryLogger';
import { isDemoMode } from '../utils/demoUtils';
import { relocateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';
import { StepID } from './søknadStepsConfig';

interface Props {
    onUgyldigMellomlagring: () => void;
    onError: () => void;
    contentLoadedRenderer: (
        formdata: SøknadFormData,
        harMellomlagring: boolean,
        lastStepID?: StepID,
        søkerdata?: Søkerdata
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    willRedirectToLoginPage: boolean;
    lastStepID?: StepID;
    formdata: SøknadFormData;
    søkerdata?: Søkerdata;
    harMellomlagring: boolean;
    harIkkeTilgang: boolean;
}

const getValidAttachments = (attachments: Attachment[] = []): Attachment[] => {
    return attachments.filter((a) => {
        return a.file?.name !== undefined;
    });
};

const isMellomlagringValid = (mellomlagring: SøknadTempStorageData): boolean => {
    return (
        mellomlagring.metadata?.version === MELLOMLAGRING_VERSION &&
        mellomlagring.formData?.harForståttRettigheterOgPlikter === true
    );
};
class SøknadEssentialsLoader extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: true,
            willRedirectToLoginPage: false,
            lastStepID: undefined,
            formdata: initialValues,
            harMellomlagring: false,
            harIkkeTilgang: false,
        };

        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.initDemoMode = this.initDemoMode.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);
        if (isDemoMode()) {
            this.initDemoMode();
        } else {
            this.loadAppEssentials();
        }
    }

    initDemoMode() {
        setTimeout(() => {
            this.setState({
                lastStepID: undefined,
                formdata: initialValues,
                søkerdata: {
                    søker: demoMockData.søker,
                    barn: demoMockData.barn,
                },
                harMellomlagring: false,
            });
            this.stopLoading();
        });
    }

    async loadAppEssentials() {
        try {
            const [mellomlagringResponse, søkerResponse, barnResponse] = await Promise.all([
                rehydrate(),
                getSøker(),
                getBarn(),
            ]);
            this.handleSøkerdataFetchSuccess(mellomlagringResponse, søkerResponse, barnResponse);
        } catch (error: any) {
            this.handleSøkerdataFetchError(error);
        }
    }

    getValidMellomlagring = async (data?: SøknadTempStorageData): Promise<SøknadTempStorageData | undefined> => {
        if (data) {
            if (isMellomlagringValid(data)) {
                return data;
            } else if (Object.keys(data).length > 0) {
                /** Mellomlagring inneholder data, men er ikke gyldig - slettes */
                this.props.onUgyldigMellomlagring();
                await purge();
            }
        }
        return undefined;
    };

    async handleSøkerdataFetchSuccess(
        mellomlagringResponse: AxiosResponse,
        søkerResponse: AxiosResponse,
        barnResponse?: AxiosResponse
    ) {
        const mellomlagring = await this.getValidMellomlagring(mellomlagringResponse?.data);
        const formData = mellomlagring?.formData
            ? {
                  ...mellomlagring.formData,
                  [SøknadFormField.legeerklæring]: getValidAttachments(mellomlagring.formData.legeerklæring),
              }
            : undefined;
        const lastStepID = mellomlagring?.metadata?.lastStepID;
        this.updateSøkerdata(
            formData || { ...initialValues },
            {
                søker: søkerResponse.data,
                barn: barnResponse ? barnResponse.data.barn : undefined,
            },
            mellomlagring?.metadata?.version !== undefined,
            lastStepID,
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    this.props.onError();
                }
            }
        );
    }

    updateSøkerdata(
        formdata: SøknadFormData,
        søkerdata: Søkerdata,
        harMellomlagring: boolean,
        lastStepID?: StepID,
        callback?: () => void
    ) {
        this.setState(
            {
                lastStepID: lastStepID || this.state.lastStepID,
                formdata: formdata || this.state.formdata,
                søkerdata: søkerdata || this.state.søkerdata,
                harMellomlagring,
            },
            callback
        );
    }

    stopLoading() {
        this.setState({
            isLoading: false,
        });
    }

    handleSøkerdataFetchError(error: AxiosError) {
        if (apiUtils.isUnauthorized(error)) {
            this.setState({ ...this.state, willRedirectToLoginPage: true });
            relocateToLoginPage();
        } else if (apiUtils.isForbidden(error)) {
            this.setState({ ...this.state, harIkkeTilgang: true });
        } else if (!userIsCurrentlyOnErrorPage()) {
            appSentryLogger.logApiError(error);
            this.props.onError();
        }
        // this timeout is set because if isLoading is updated in the state too soon,
        // the contentLoadedRenderer() will be called while the user is still on the wrong route,
        // because the redirect to routeConfig.ERROR_PAGE_ROUTE will not have happened yet.
        setTimeout(this.stopLoading, 200);
    }

    render() {
        const { contentLoadedRenderer } = this.props;
        const {
            isLoading,
            harIkkeTilgang,
            willRedirectToLoginPage,
            lastStepID,
            formdata,
            søkerdata,
            harMellomlagring,
        } = this.state;
        if (isLoading || willRedirectToLoginPage) {
            return <LoadingPage />;
        }
        if (harIkkeTilgang) {
            return <IkkeTilgangPage />;
        }
        return (
            <SøkerdataContextProvider value={søkerdata}>
                {contentLoadedRenderer(formdata, harMellomlagring, lastStepID, søkerdata)}
            </SøkerdataContextProvider>
        );
    }
}

export default SøknadEssentialsLoader;
