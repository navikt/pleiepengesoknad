import { StepID } from '../søknad/søknadStepsConfig';
import { SøknadFormValues } from './SøknadFormValues';

export const MELLOMLAGRING_VERSION = '11.0.1';

export interface MellomlagringMetadata {
    version: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
}

export interface SøknadTempStorageData {
    metadata: MellomlagringMetadata;
    formData: SøknadFormValues;
}
