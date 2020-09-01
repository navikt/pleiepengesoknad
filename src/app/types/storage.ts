import { isStepID, StepID } from '../config/stepConfig';
import * as IoTs from 'io-ts';
import { FetchRecipe } from '../utils/fetcher/types';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';
import { isString } from '@sif-common/core/utils/typeGuardUtils';
import { isPleiepengesøknadFormData, PleiepengesøknadFormData } from './PleiepengesøknadFormData';
import * as fetcher2 from '../utils/fetcher2/types';

export const MELLOMLAGRING_VERSION = '3';

interface StorageMetadata {
    version: string;
    lastStepID: StepID;
}

export const isStorageMetadata = (maybeStorageMetadata: any): maybeStorageMetadata is StorageMetadata =>
    maybeStorageMetadata.version &&
    isString(maybeStorageMetadata.version) &&
    maybeStorageMetadata.lastStepID &&
    isStepID(maybeStorageMetadata.lastStepID);

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: PleiepengesøknadFormData;
}

export const isMellomlagringData = (maybeMellomlagringData: any): maybeMellomlagringData is MellomlagringData =>
    maybeMellomlagringData &&
    maybeMellomlagringData.metadata &&
    isStorageMetadata(maybeMellomlagringData.metadata) &&
    maybeMellomlagringData.formData &&
    isPleiepengesøknadFormData(maybeMellomlagringData.formData, maybeMellomlagringData.metadata.version);

export type MaybeMellomlagringData = any;

export const isMaybeMellomlagringData = (value: any): value is MaybeMellomlagringData => {
    return value !== undefined;
};

export const isMaybeMellomlagringDataValidator: IoTs.Type<MaybeMellomlagringData> = new IoTs.Type<
    MaybeMellomlagringData,
    MaybeMellomlagringData,
    unknown
>(
    'isMellomlagringDataType',
    isMaybeMellomlagringData,
    (input: unknown, context: IoTs.Context) =>
        isMaybeMellomlagringData(input) ? IoTs.success(input) : IoTs.failure(input, context),
    IoTs.identity
);

export const fetchMaybeMellomlagringDataRecipe: FetchRecipe<MaybeMellomlagringData> = {
    url: getApiUrlByResourceType(ResourceType.MELLOMLAGRING),
    validator: isMaybeMellomlagringDataValidator,
};

export const fetcherMaybeMellomlagringDataRecipe: fetcher2.FetchRecipe<MaybeMellomlagringData> = {
    url: getApiUrlByResourceType(ResourceType.MELLOMLAGRING),
    typeguard: isMaybeMellomlagringData,
};
