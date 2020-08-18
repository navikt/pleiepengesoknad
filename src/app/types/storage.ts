import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';
import * as IoTs from 'io-ts';
import { FetchRecipe } from '../utils/fetcher/types';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';

export const MELLOMLAGRING_VERSION = '3';

interface StorageMetadata {
    version: string;
    lastStepID: StepID;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: PleiepengesøknadFormData;
}

export const isMellomlagringData = (input: any): input is MellomlagringData => {
    // TODO: Implementer type guard
    return input !== undefined;
};

export const isMellomlagringDataValidator: IoTs.Type<MellomlagringData> = new IoTs.Type<
    MellomlagringData,
    MellomlagringData,
    unknown
>(
    'isMellomlagringDataType',
    isMellomlagringData,
    (input: unknown, context: IoTs.Context) =>
        isMellomlagringData(input) ? IoTs.success(input) : IoTs.failure(input, context),
    IoTs.identity
);

export const fetchMellomlagringDataRecipe: FetchRecipe<MellomlagringData> = {
    url: getApiUrlByResourceType(ResourceType.MELLOMLAGRING),
    validator: isMellomlagringDataValidator,
};
