import React from 'react';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';
import * as apiUtils from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError, AxiosResponse } from 'axios';
import { getBarn, getForrigeSoknad, getSøker, purge, rehydrate } from '../api/api';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import LoadingPage from '../pages/loading-page/LoadingPage';
import { ForrigeSøknad } from '../types/ForrigeSøknad';
import { InnsendtSøknad } from '../types/InnsendtSøknad';
import { Søkerdata } from '../types/Søkerdata';
import { initialValues, SøknadFormField, SøknadFormValues } from '../types/SøknadFormValues';
import { MELLOMLAGRING_VERSION, SøknadTempStorageData } from '../types/SøknadTempStorageData';
import appSentryLogger from '../utils/appSentryLogger';
import { getFormValuesFromInnsendtSøknad } from '../utils/innsendtSøknadToFormValues/getFormValuesFromInnsendtSøknad';
import { relocateToLoginPage, userIsCurrentlyOnErrorPage } from '../utils/navigationUtils';
import { StepID } from './søknadStepsConfig';
import { forrigeSøknadErGyldig } from '../utils/forrigeSøknadUtils';

interface Props {
    onUgyldigMellomlagring: () => void;
    onError: () => void;
    contentLoadedRenderer: (content: {
        formdata: SøknadFormValues;
        harMellomlagring: boolean;
        lastStepID?: StepID;
        søkerdata?: Søkerdata;
        forrigeSøknad?: ForrigeSøknad;
    }) => React.ReactNode;
}

interface State {
    isLoading: boolean;
    willRedirectToLoginPage: boolean;
    lastStepID?: StepID;
    formdata: SøknadFormValues;
    søkerdata?: Søkerdata;
    forrigeSøknad?: ForrigeSøknad;
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
        this.handleSøkerdataFetchSuccess = this.handleSøkerdataFetchSuccess.bind(this);
        this.handleSøkerdataFetchError = this.handleSøkerdataFetchError.bind(this);
        this.loadAppEssentials();
    }

    async loadAppEssentials() {
        try {
            const [mellomlagringResponse, søkerResponse, barnResponse, forrigeSøknadResponse] = await Promise.all([
                rehydrate(),
                getSøker(),
                getBarn(),
                getForrigeSoknad(),
            ]);
            this.handleSøkerdataFetchSuccess(mellomlagringResponse, søkerResponse, barnResponse, forrigeSøknadResponse);
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
        barnResponse?: AxiosResponse,
        forrigeSøknadReponse?: AxiosResponse<InnsendtSøknad>
    ) {
        const registrerteBarn = barnResponse ? barnResponse.data.barn : undefined;
        const mellomlagring = await this.getValidMellomlagring(mellomlagringResponse?.data);
        const formData = mellomlagring?.formData
            ? {
                  ...mellomlagring.formData,
                  [SøknadFormField.legeerklæring]: getValidAttachments(mellomlagring.formData.legeerklæring),
              }
            : undefined;
        const lastStepID = mellomlagring?.metadata?.lastStepID;
        const harMellomlagring = mellomlagring?.metadata?.version !== undefined;

        let forrigeSøknad: ForrigeSøknad | undefined;

        if (
            harMellomlagring === false &&
            forrigeSøknadReponse?.data &&
            forrigeSøknadErGyldig(forrigeSøknadReponse.data.søknad)
        ) {
            const values = getFormValuesFromInnsendtSøknad(forrigeSøknadReponse.data.søknad, registrerteBarn);
            if (values) {
                forrigeSøknad = {
                    søknadId: forrigeSøknadReponse.data.søknadId,
                    values,
                };
            }
        }

        this.updateSøkerdata(
            formData || { ...initialValues },
            {
                søker: søkerResponse.data,
                barn: registrerteBarn,
            },
            forrigeSøknad,
            harMellomlagring,
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
        formdata: SøknadFormValues,
        søkerdata: Søkerdata,
        forrigeSøknad: ForrigeSøknad | undefined,
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
                forrigeSøknad: forrigeSøknad || this.state.forrigeSøknad,
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
            forrigeSøknad,
        } = this.state;
        if (isLoading || willRedirectToLoginPage) {
            return <LoadingPage />;
        }
        if (harIkkeTilgang) {
            return <IkkeTilgangPage />;
        }
        return (
            <SøkerdataContextProvider value={søkerdata}>
                {contentLoadedRenderer({ formdata, harMellomlagring, lastStepID, søkerdata, forrigeSøknad })}
            </SøkerdataContextProvider>
        );
    }
}

export default SøknadEssentialsLoader;
