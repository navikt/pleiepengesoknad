import { isStepID, StepID } from '../config/stepConfig';
import { getApiUrlByResourceType } from '../utils/apiUtils';
import { ResourceType } from './ResourceType';
import { isString } from '@sif-common/core/utils/typeGuardUtils';
import { isValidFormdataVersion, PleiepengesøknadFormData } from './PleiepengesøknadFormData';
import { FetchRecipe } from '../utils/fetcher/types';
import { Either, left, right } from 'fp-ts/Either';

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

export const isValidMellomlagringsData = (maybeMellomlagringData: any): maybeMellomlagringData is MellomlagringData =>
    maybeMellomlagringData &&
    maybeMellomlagringData.metadata &&
    isStorageMetadata(maybeMellomlagringData.metadata) &&
    maybeMellomlagringData.formData &&
    isValidFormdataVersion(maybeMellomlagringData.formData, maybeMellomlagringData.metadata.version);

export const validateMellomlagringsData = (
    maybeMellomlagringData: any,
    initialPleiepengesøknadFormData: PleiepengesøknadFormData
): Either<[PleiepengesøknadFormData, StepID], PleiepengesøknadFormData> => {
    if (isValidMellomlagringsData(maybeMellomlagringData)) {
        return left([maybeMellomlagringData.formData, maybeMellomlagringData.metadata.lastStepID]);
    } else {
        return right(initialPleiepengesøknadFormData);
    }
};

export type MaybeMellomlagringData = any;

export const isMaybeMellomlagringData = (value: any): value is MaybeMellomlagringData => {
    return value !== undefined;
};

export const maybeMellomlagringDataRecipe: FetchRecipe<MaybeMellomlagringData> = {
    url: getApiUrlByResourceType(ResourceType.MELLOMLAGRING),
    typeguard: isMaybeMellomlagringData,
};
