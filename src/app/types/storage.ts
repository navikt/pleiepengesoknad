import { StepID } from '../config/stepConfig';
import { SøknadFormData } from './SøknadFormData';

/** Persistence */
export const MELLOMLAGRING_VERSION = '7.4';
interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: Partial<SøknadFormData>;
}
