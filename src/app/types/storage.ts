import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';
import { StepID } from '../config/stepConfig';

interface StorageMetadata {
    lastStepID: StepID;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: PleiepengesøknadFormData;
}