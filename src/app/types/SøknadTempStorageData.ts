import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormData } from './SøknadFormData';

export const MELLOMLAGRING_VERSION = '11.0.0';

interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface SøknadTempStorageData {
    metadata: StorageMetadata;
    formData: SøknadFormData;
}
