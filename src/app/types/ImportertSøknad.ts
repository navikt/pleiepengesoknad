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
}

export type ImportertSøknad = {
    metaData: ImportertSøknadMetadata;
    formValues: SøknadFormValues;
};
