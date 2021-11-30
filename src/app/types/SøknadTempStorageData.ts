import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from './SøknadFormData';

/** Persistence */
export const MELLOMLAGRING_VERSION = '7.4';
interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface SøknadTempStorageData {
    metadata: StorageMetadata;
    formData: Partial<SøknadFormData>;
}
