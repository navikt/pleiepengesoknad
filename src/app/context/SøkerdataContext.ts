import * as React from 'react';
import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData';
import { Søkerdata } from '../types/Søkerdata';

export interface Appdata {
    lastStepID?: StepID;
    søkerdata: Søkerdata;
    formdata: PleiepengesøknadFormData;
}

export const SøkerdataContext = React.createContext<Søkerdata | undefined>(undefined);

export const SøkerdataContextProvider = SøkerdataContext.Provider;
export const SøkerdataContextConsumer = SøkerdataContext.Consumer;
