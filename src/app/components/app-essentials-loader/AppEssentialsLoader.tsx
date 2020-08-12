import * as React from 'react';
import { AxiosError, AxiosResponse } from 'axios';
import { Attachment } from 'common/types/Attachment';
import { getBarn, getSøker, rehydrate } from '../../api/api';
import routeConfig from '../../config/routeConfig';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import { AppFormField, initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { MELLOMLAGRING_VERSION, MellomlagringData } from '../../types/storage';
import { Arbeidsgiver, Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '../../utils/apiUtils';
import appSentryLogger from '../../utils/appSentryLogger';
import { navigateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { useEffect, useState } from 'react';

export const VERIFY_MELLOMLAGRING_VERSION = true;

interface Props {
    contentLoadedRenderer: (
        formdata: PleiepengesøknadFormData,
        lastStepID?: StepID,
        søkerdata?: Søkerdata
    ) => React.ReactNode;
}

interface State {
    initialRender: boolean;
    isLoading: boolean;
    lastStepID?: StepID;
    formdata: PleiepengesøknadFormData;
    søkerdata?: Søkerdata;
}

const initialState: State = {
    initialRender: true,
    isLoading: true,
    lastStepID: undefined,
    formdata: initialValues,
};

const getValidAttachments = (attachments: Attachment[] = []): Attachment[] => {
    return attachments.filter((a) => {
        return a.file?.name !== undefined;
    });
};

const AppEssentialsLoader: React.FC<Props> = (props: Props): React.ReactElement => {
    const { contentLoadedRenderer } = props;

    const [state, setState] = useState(initialState);
    const { initialRender, isLoading, lastStepID, formdata, søkerdata } = state;

    function stopLoading() {
        setState({
            ...state,
            isLoading: false,
            initialRender: false,
        });
    }

    function getValidMellomlagring(data?: MellomlagringData): MellomlagringData | undefined {
        if (VERIFY_MELLOMLAGRING_VERSION) {
            if (data?.metadata?.version === MELLOMLAGRING_VERSION) {
                return data;
            }
            return undefined;
        }
        return data;
    }

    function updateSøkerdata(formdata: PleiepengesøknadFormData, søkerdata: Søkerdata, lastStepID?: StepID) {
        setState({
            initialRender: false,
            isLoading: false,
            lastStepID: lastStepID || state.lastStepID,
            formdata: formdata || state.formdata,
            søkerdata: søkerdata || state.søkerdata,
        });
        stopLoading();
        if (userIsCurrentlyOnErrorPage()) {
            window.location.assign(routeConfig.WELCOMING_PAGE_ROUTE);
        }
    }

    function updateArbeidsgivere(arbeidsgivere: Arbeidsgiver[]) {
        if (state.søkerdata) {
            const { barn, person, setArbeidsgivere } = state.søkerdata;
            setState({
                ...state,
                søkerdata: {
                    barn,
                    setArbeidsgivere,
                    arbeidsgivere,
                    person,
                },
            });
        }
    }

    function handleSøkerdataFetchSuccess(
        mellomlagringResponse: AxiosResponse,
        søkerResponse: AxiosResponse,
        barnResponse?: AxiosResponse
    ) {
        const mellomlagring = getValidMellomlagring(mellomlagringResponse?.data);
        const formData = mellomlagring?.formData
            ? {
                  ...mellomlagring.formData,
                  [AppFormField.legeerklæring]: getValidAttachments(mellomlagring.formData.legeerklæring),
              }
            : undefined;
        const lastStepID = mellomlagring?.metadata?.lastStepID;
        updateSøkerdata(
            formData || { ...initialValues },
            {
                person: søkerResponse.data,
                barn: barnResponse ? barnResponse.data.barn : undefined,
                setArbeidsgivere: updateArbeidsgivere,
                arbeidsgivere: [],
            },
            lastStepID
        );
    }

    function handleSøkerdataFetchError(error: AxiosError) {
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            navigateToLoginPage();
        } else if (!userIsCurrentlyOnErrorPage()) {
            appSentryLogger.logApiError(error);
            window.location.assign(routeConfig.ERROR_PAGE_ROUTE);
            // this timeout is set because if isLoading is updated in the state too soon,
            // the contentLoadedRenderer() will be called while the user is still on the wrong route,
            // because the redirect to routeConfig.ERROR_PAGE_ROUTE will not have happened yet.
            setTimeout(stopLoading, 200);
        }
    }

    async function loadAppEssentials() {
        try {
            const [mellomlagringResponse, søkerResponse, barnResponse] = await Promise.all([
                rehydrate(),
                getSøker(),
                getBarn(),
            ]);
            handleSøkerdataFetchSuccess(mellomlagringResponse, søkerResponse, barnResponse);
        } catch (error) {
            handleSøkerdataFetchError(error);
        }
    }

    useEffect(() => {
        if (initialRender) {
            setState({ ...state, initialRender: false });
            loadAppEssentials();
        }
    });

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
};

export default AppEssentialsLoader;
