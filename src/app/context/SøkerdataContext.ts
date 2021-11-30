import * as React from 'react';
import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from '../types/SøknadFormData';
import { Søkerdata } from '../types/Søkerdata';

export interface Appdata {
    lastStepID?: StepID;
    søkerdata: Søkerdata;
    formdata: SøknadFormData;
}
export const SøkerdataContext = React.createContext<Søkerdata | undefined>(undefined);

export const SøkerdataContextProvider = SøkerdataContext.Provider;
export const SøkerdataContextConsumer = SøkerdataContext.Consumer;
