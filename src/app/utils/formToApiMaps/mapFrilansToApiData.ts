import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { FrilansApiData } from '../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { mapSNFArbeidsforholdToApiData } from './mapSNFArbeidsforholdToApiData';

export const mapFrilansToApiData = (formData: PleiepengesøknadFormData): FrilansApiData | undefined => {
    const { frilans_jobberFortsattSomFrilans, frilans_startdato, frilans_arbeidsforhold, frilans_sluttdato } = formData;

    if (frilans_jobberFortsattSomFrilans && frilans_startdato) {
        const data: FrilansApiData = {
            startdato: frilans_startdato,
            jobberFortsattSomFrilans: frilans_jobberFortsattSomFrilans === YesOrNo.YES,
            arbeidsforhold: frilans_arbeidsforhold ? mapSNFArbeidsforholdToApiData(frilans_arbeidsforhold) : undefined,
            sluttdato: frilans_jobberFortsattSomFrilans === YesOrNo.NO ? frilans_sluttdato : undefined,
        };
        return data;
    }
    return undefined;
};
