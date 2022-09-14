import { StepID } from '../søknad/søknadStepsConfig';
import { ImportertSøknadMetadata } from './ImportertSøknad';
import { SøknadFormValues } from './SøknadFormValues';

export const MELLOMLAGRING_VERSION = '12.0.0';

export interface MellomlagringMetadata {
    version: string;
    søknadId: string;
    lastStepID?: StepID;
    updatedTimestemp: string;
    importertSøknadMetadata?: ImportertSøknadMetadata;
    userHash: string;
}

export interface SøknadMellomlagring {
    metadata: MellomlagringMetadata;
    formValues: SøknadFormValues;
}
