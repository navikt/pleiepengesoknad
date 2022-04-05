import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from './SøknadFormData';

export const MELLOMLAGRING_VERSION = '10.01';

interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface SøknadTempStorageData {
    metadata: StorageMetadata;
    formData: SøknadFormData;
}
