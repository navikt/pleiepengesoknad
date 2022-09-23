import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from './SøknadFormData';

export const MELLOMLAGRING_VERSION = '12.1.0';

interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface SøknadTempStorageData {
    metadata: StorageMetadata;
    formData: SøknadFormData;
}
