import React, { useState } from 'react';
import { Søknadsdata } from '../types/søknadsdata/Søknadsdata';
import { SøknadsdataContextProvider } from './SøknadsdataContext';

interface Props {
    initialSøknadsdata: Søknadsdata;
}

const SøknadsdataWrapper: React.FunctionComponent<Props> = ({ initialSøknadsdata, children }) => {
    const [søknadsdata, setSøknadsdata] = useState<Søknadsdata>(initialSøknadsdata);
    return (
        <SøknadsdataContextProvider
            value={{
                søknadsdata: søknadsdata,
                setSøknadsdata: (søknadsdata) => setSøknadsdata(søknadsdata),
            }}>
            {children}
        </SøknadsdataContextProvider>
    );
};

export default SøknadsdataWrapper;
