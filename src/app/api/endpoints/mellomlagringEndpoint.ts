import { failure, RemoteData, success } from '@devexperts/remote-data-ts';
import persistence, { PersistenceInterface } from '@navikt/sif-common-core/lib/utils/persistence/persistence';
import { jsonSort } from '@navikt/sif-common-utils/lib';
import { AxiosError, AxiosResponse } from 'axios';
import { isObject } from 'formik';
import hash from 'object-hash';
import { StepID } from '../../søknad/søknadStepsConfig';
import { RegistrertBarn, Søker } from '../../types';
import { ImportertSøknadMetadata } from '../../types/ImportertSøknad';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { MELLOMLAGRING_VERSION, SøknadMellomlagring } from '../../types/SøknadMellomlagring';
import { axiosConfigPsb } from '../api';
import { ApiEndpointPsb } from '../endpoints';

export interface UserHashInfo {
    søker: Søker;
    registrerteBarn: RegistrertBarn[];
}

interface UpdateProps {
    søknadId: string;
    formValues: SøknadFormValues;
    lastStepID: StepID;
    søkerInfo: UserHashInfo;
    importertSøknadMetadata?: ImportertSøknadMetadata;
}

interface MellomlagringEndpoint
    extends Omit<PersistenceInterface<SøknadMellomlagring>, 'update' | 'rehydrate' | 'persist'> {
    update: (props: UpdateProps) => Promise<AxiosResponse>;
    fetch: () => Promise<RemoteData<AxiosError, SøknadMellomlagring | undefined>>;
}

const persistSetup = persistence<SøknadMellomlagring>({
    url: ApiEndpointPsb.MELLOMLAGRING,
    requestConfig: { ...axiosConfigPsb },
});

export const createUserHashInfoString = (info: UserHashInfo) => {
    return hash(JSON.stringify(jsonSort(info)));
};

export const isMellomlagringValid = (
    data: SøknadMellomlagring,
    userHashInfo: UserHashInfo
): SøknadMellomlagring | undefined => {
    if (
        data?.metadata?.version === MELLOMLAGRING_VERSION &&
        data?.metadata.lastStepID !== undefined &&
        data.formValues !== undefined &&
        data.formValues.harForståttRettigheterOgPlikter === true &&
        data.metadata.søknadId !== undefined &&
        JSON.stringify(data.formValues) !== JSON.stringify({}) &&
        createUserHashInfoString(userHashInfo) === data.metadata.userHash
    ) {
        return data;
    }
    return undefined;
};

const mellomlagringEndpoint: MellomlagringEndpoint = {
    create: () => {
        return persistSetup.create();
    },
    update: ({ søknadId, formValues, lastStepID, søkerInfo, importertSøknadMetadata }) => {
        return persistSetup.update({
            formValues,
            metadata: {
                søknadId,
                lastStepID,
                version: MELLOMLAGRING_VERSION,
                userHash: createUserHashInfoString(søkerInfo),
                updatedTimestemp: new Date().toISOString(),
                importertSøknadMetadata,
            },
        });
    },
    purge: persistSetup.purge,
    fetch: async () => {
        try {
            const { data } = await persistSetup.rehydrate();
            if (data && isObject(data) && Object.keys(data).length > 0) {
                return Promise.resolve(success(data));
            }
            return Promise.resolve(success(undefined));
        } catch (error) {
            return Promise.reject(failure(error));
        }
    },
};

export default mellomlagringEndpoint;
