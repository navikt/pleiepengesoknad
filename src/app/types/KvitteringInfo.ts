import { ArbeidsgiverApiData } from './SøknadApiData';
export interface KvitteringInfo {
    fom: Date;
    tom: Date;
    søkernavn: string;
    arbeidsgivere: ArbeidsgiverApiData[];
}
