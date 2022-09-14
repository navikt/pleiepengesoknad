import React from 'react';
import { useIntl } from 'react-intl';
import { isForbidden } from '@navikt/sif-common-core/lib/utils/apiUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import RemoteDataHandler from '@navikt/sif-common-soknad/lib/remote-data-handler/RemoteDataHandler';
import ErrorPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/ErrorPage';
import LoadingPage from '@navikt/sif-common-soknad/lib/soknad-common-pages/LoadingPage';
import SoknadErrorMessages from '@navikt/sif-common-soknad/lib/soknad-error-messages/SoknadErrorMessages';
import useSoknadEssentials, { SoknadEssentials } from '../hooks/useSoknadEssentials';
import IkkeTilgangPage from '../pages/ikke-tilgang-page/IkkeTilgangPage';
import Søknad from './Søknad';
import appSentryLogger from '../utils/appSentryLogger';
import { ImportertSøknad } from '../types/ImportertSøknad';
import { importerSøknad } from '../utils/importInnsendtSøknad/importSøknad';
import { forrigeSøknadErGyldig } from '../utils/forrigeSøknadUtils';
import SøknadsdataWrapper from './SøknadsdataWrapper';
import { SøkerdataContextProvider } from '../context/SøkerdataContext';

const HandleError = (error: any) => {
    const intl = useIntl();
    const isStringError = typeof error === 'string';

    if (isForbidden(error)) {
        return <IkkeTilgangPage />;
    }
    if (isStringError) {
        appSentryLogger.logError('søknadEssentials error', error);
    }

    return (
        <ErrorPage
            bannerTitle={intlHelper(intl, 'application.title')}
            contentRenderer={() => <SoknadErrorMessages.GeneralApplicationError />}
        />
    );
};

const SoknadRemoteDataFetcher = () => {
    const soknadEssentials = useSoknadEssentials();
    return (
        <RemoteDataHandler<SoknadEssentials>
            remoteData={soknadEssentials}
            initializing={() => <LoadingPage />}
            loading={() => <LoadingPage />}
            error={(error) => <HandleError error={error} />}
            success={([søker, registrerteBarn, mellomlagring, forrigeSøknad]) => {
                let importertSøknad: ImportertSøknad | undefined;
                if (
                    mellomlagring === undefined &&
                    forrigeSøknad?.søknad &&
                    forrigeSøknadErGyldig(forrigeSøknad.søknad)
                ) {
                    const result = importerSøknad(forrigeSøknad.søknad, registrerteBarn);
                    if (result) {
                        const { formValues, endringer } = result;
                        importertSøknad = {
                            formValues,
                            metaData: {
                                søknadId: forrigeSøknad.søknadId,
                                mottatt: forrigeSøknad.søknad.mottatt,
                                endringer,
                                barn: result.registrertBarn,
                            },
                        };
                    }
                }

                return (
                    <SøkerdataContextProvider value={{ søker, barn: registrerteBarn }}>
                        <SøknadsdataWrapper initialSøknadsdata={{}}>
                            <Søknad
                                søker={søker}
                                registrerteBarn={registrerteBarn}
                                mellomlagring={mellomlagring}
                                forrigeSøknad={importertSøknad}
                            />
                        </SøknadsdataWrapper>
                    </SøkerdataContextProvider>
                );
            }}
        />
    );
};

export default SoknadRemoteDataFetcher;
