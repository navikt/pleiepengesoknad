import { useEffect, useState } from 'react';
import { combine, initial, pending, RemoteData, failure } from '@devexperts/remote-data-ts';
import { isUserLoggedOut } from '@navikt/sif-common-core/lib/utils/apiUtils';
import { AxiosError } from 'axios';
import { RegistrertBarn, Søker } from '../types';
import { SøknadMellomlagring } from '../types/SøknadMellomlagring';
import { relocateToLoginPage } from '../utils/navigationUtils';
import søkerEndpoint from '../api/endpoints/søkerEndpoint';
import registrerteBarnEndpoint from '../api/endpoints/registrerteBarnEndpoint';
import mellomlagringEndpoint from '../api/endpoints/mellomlagringEndpoint';
import forrigeSøknadEndpoint from '../api/endpoints/forrigeSøknadEndpoint';
import { InnsendtSøknad } from '../types/InnsendtSøknad';

export type SoknadEssentials = [Søker, RegistrertBarn[], SøknadMellomlagring | undefined, InnsendtSøknad | undefined];

export type SoknadEssentialsRemoteData = RemoteData<AxiosError, SoknadEssentials>;

function useSoknadEssentials(): SoknadEssentialsRemoteData {
    const [data, setData] = useState<SoknadEssentialsRemoteData>(initial);
    const fetch = async () => {
        try {
            const [sokerResult, barnResult, soknadTempStorageResult, forrigeSøknad] = await Promise.all([
                søkerEndpoint.fetch(),
                registrerteBarnEndpoint.fetch(),
                mellomlagringEndpoint.fetch(),
                forrigeSøknadEndpoint.fetch(),
            ]);
            setData(combine(sokerResult, barnResult, soknadTempStorageResult, forrigeSøknad));
        } catch (remoteDataError: any) {
            if (isUserLoggedOut(remoteDataError.error)) {
                setData(pending);
                relocateToLoginPage();
            } else {
                console.error(remoteDataError);
                setData(failure(remoteDataError));
            }
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    return data;
}

export default useSoknadEssentials;
