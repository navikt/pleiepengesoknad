import { createContext, useContext } from 'react';
import { initial } from '@devexperts/remote-data-ts';
import {
    SendSoknadStatusInterface,
    SoknadContextInterface as SøknadContextInterface,
} from '@navikt/sif-common-soknad/lib/soknad-context/SoknadContext';
import { SøknadApiData } from '../types/søknad-api-data/SøknadApiData';
import { StepID } from './søknadStepsConfig';

export type SendSøknadStatus = SendSoknadStatusInterface<SøknadApiData>;
export type SoknadContext = SøknadContextInterface<StepID, SøknadApiData>;

const søknadContext = createContext<SøknadContextInterface<StepID, SøknadApiData> | undefined>(undefined);
export const SøknadContextProvider = søknadContext.Provider;
export const SøknadContextConsumer = søknadContext.Consumer;

export const useSøknadContext = () => {
    const context = useContext(søknadContext);
    if (context === undefined) {
        throw new Error('useSøknadContext needs to be called within a SoknadContext');
    }
    return context;
};

export const initialSendSoknadState: SendSøknadStatus = {
    failures: 0,
    status: initial,
};
