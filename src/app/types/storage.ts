import { StepID } from '../config/stepConfig';
import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';

export const MELLOMLAGRING_VERSION = '4.0.2';

interface StorageMetadata {
    version: string;
    lastStepID: StepID;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: Partial<PleiepengesøknadFormData>;
}
