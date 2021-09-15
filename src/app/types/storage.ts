import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';

/** Persistence */
export const MELLOMLAGRING_VERSION = '7.0';
interface StorageMetadata {
    version: string;
    lastStepID?: StepID;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: Partial<PleiepengesøknadFormData>;
}
