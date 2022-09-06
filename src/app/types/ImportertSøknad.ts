import { RegistrerteBarn } from './RegistrerteBarn';
import { SøknadFormValues } from './SøknadFormValues';

export enum SøknadsimportEndringstype {
    'endretBostedUtland' = 'endretBostedUtland',
}

export type SøknadsimportEndring = {
    type: SøknadsimportEndringstype;
};

export interface ImportertSøknadMetadata {
    søknadId: string;
    mottatt: Date;
    endringer: SøknadsimportEndring[];
    barn: RegistrerteBarn;
}

export type ImportertSøknad = {
    metaData: ImportertSøknadMetadata;
    formValues: SøknadFormValues;
};
