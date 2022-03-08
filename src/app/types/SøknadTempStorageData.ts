import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from './SøknadFormData';

/** Persistence */
export const MELLOMLAGRING_VERSION = '9';

interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface SøknadTempStorageData {
    metadata: StorageMetadata;
    formData: Partial<SøknadFormData>;
}
