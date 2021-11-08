import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';

/** Persistence */
export const MELLOMLAGRING_VERSION = '7.3';
interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: Partial<PleiepengesøknadFormData>;
}
