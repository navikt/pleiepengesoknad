import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';

export const MELLOMLAGRING_VERSION = '3';

interface StorageMetadata {
    version: string;
    lastStepID: StepID;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: Partial<PleiepengesøknadFormData>;
}
