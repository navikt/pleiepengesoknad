import * as React from 'react';
import { Søkerdata } from '../types/Søkerdata';
import { PleiepengesøknadFormData } from '../types/PleiepengesøknadFormData'

export interface Appdata {
    søkerdata: Søkerdata;
    formdata: PleiepengesøknadFormData;
}
const SøkerdataContext = React.createContext<Søkerdata | undefined>(undefined);

export const SøkerdataContextProvider = SøkerdataContext.Provider;
export const SøkerdataContextConsumer = SøkerdataContext.Consumer;
