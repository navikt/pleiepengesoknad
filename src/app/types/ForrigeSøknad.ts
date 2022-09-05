import { ForrigeSøknadImportEndring } from '../utils/innsendtSøknadToFormValues/importForrigeSøknad';
import { SøknadFormValues } from './SøknadFormValues';

export interface ForrigeSøknadMetadata {
    søknadId: string;
    mottatt: Date;
    endringer: ForrigeSøknadImportEndring[];
}

export type ForrigeSøknad = {
    metaData: ForrigeSøknadMetadata;
    formValues: SøknadFormValues;
};
