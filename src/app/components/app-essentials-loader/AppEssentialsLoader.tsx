import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getSøker, rehydrate } from '../../api/api';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import { AppFormField, initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { MELLOMLAGRING_VERSION, MellomlagringData } from '../../types/storage';
import { Arbeidsgiver, Søkerdata } from '../../types/Søkerdata';
import * as apiUtils from '../../utils/apiUtils';
import appSentryLogger from '../../utils/appSentryLogger';
import { navigateToErrorPage, relocateToLoginPage, userIsCurrentlyOnErrorPage } from '../../utils/navigationUtils';
import LoadingPage from '../pages/loading-page/LoadingPage';

export const VERIFY_MELLOMLAGRING_VERSION = true;

interface OwnProps {
    contentLoadedRenderer: (
        formdata: Partial<PleiepengesøknadFormData>,
        harMellomlagring: boolean,
        lastStepID?: StepID,
        søkerdata?: Søkerdata
    ) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    willRedirectToLoginPage: boolean;
    lastStepID?: StepID;
    formdata: Partial<PleiepengesøknadFormData>;
    søkerdata?: Søkerdata;
    harMellomlagring: boolean;
}

type Props = OwnProps & RouteComponentProps;

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
            willRedirectToLoginPage: false,
            lastStepID: undefined,
            formdata: initialValues,
            harMellomlagring: false,
        };

        this.updateArbeidsgivere = this.updateArbeidsgivere.bind(this);
        this.updateSøkerdata = this.updateSøkerdata.bind(this);
        this.stopLoading = this.stopLoading.bind(this);
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);
        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const [mellomlagringResponse, søkerResponse, barnResponse] = await Promise.all([
                rehydrate(),
                getSøker(),
                getBarn(),
            ]);
            this.handleSøkerdataFetchSuccess(mellomlagringResponse, søkerResponse, barnResponse);
        } catch (error) {
            this.handleSøkerdataFetchError(error);
        }
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
                  [AppFormField.legeerklæring]: getValidAttachments(mellomlagring.formData.legeerklæring),
              }
            : undefined;
        const lastStepID = mellomlagring?.metadata?.lastStepID;
        this.updateSøkerdata(
            formData || { ...initialValues },
            {
                person: søkerResponse.data,
                barn: barnResponse ? barnResponse.data.barn : undefined,
                setArbeidsgivere: this.updateArbeidsgivere,
                arbeidsgivere: [],
            },
            mellomlagring?.metadata?.version !== undefined,
            lastStepID,
            () => {
                this.stopLoading();
                if (userIsCurrentlyOnErrorPage()) {
                    navigateToErrorPage(this.props.history);
                }
            }
        );
    }

    updateSøkerdata(
        formdata: Partial<PleiepengesøknadFormData>,
        søkerdata: Søkerdata,
        harMellomlagring: boolean,
        lastStepID?: StepID,
        callback?: () => void
    ) {
        this.setState(
            {
                isLoading: false,
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
        if (apiUtils.isForbidden(error) || apiUtils.isUnauthorized(error)) {
            this.setState({ ...this.state, willRedirectToLoginPage: true });
            relocateToLoginPage();
        } else if (!userIsCurrentlyOnErrorPage()) {
            appSentryLogger.logApiError(error);
            navigateToErrorPage(this.props.history);
        }
        // this timeout is set because if isLoading is updated in the state too soon,
        // the contentLoadedRenderer() will be called while the user is still on the wrong route,
        // because the redirect to routeConfig.ERROR_PAGE_ROUTE will not have happened yet.
        setTimeout(this.stopLoading, 200);
    }

    updateArbeidsgivere(arbeidsgivere: Arbeidsgiver[]) {
        if (this.state.søkerdata) {
            const { barn, person, setArbeidsgivere } = this.state.søkerdata;
            this.setState({
                søkerdata: {
                    barn,
                    setArbeidsgivere,
                    arbeidsgivere,
                    person,
                },
            });
        }
    }

    render() {
        const { contentLoadedRenderer } = this.props;
        const { isLoading, willRedirectToLoginPage, lastStepID, formdata, søkerdata, harMellomlagring } = this.state;
        if (isLoading || willRedirectToLoginPage) {
            return <LoadingPage />;
        }
        return (
            <>
                <SøkerdataContextProvider value={søkerdata}>
                    {contentLoadedRenderer(formdata, harMellomlagring, lastStepID, søkerdata)}
                </SøkerdataContextProvider>
            </>
        );
    }
}

export default withRouter(AppEssentialsLoader);
