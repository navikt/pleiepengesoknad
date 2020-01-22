import { PleiepengesøknadFormData } from './PleiepengesøknadFormData';
import { StepID } from '../config/stepConfig';

interface StorageMetadata {
    step: StepID;
}

export interface MellomlagringData {
    metadata: StorageMetadata;
    formData: PleiepengesøknadFormData;
}