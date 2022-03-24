import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { SøknadApiData } from '../../types/SøknadApiData';
import { ArbeidFrilansSøknadsdata } from '../../types/Søknadsdata';
import { arbeidsforholdSøknadsdataToApiData } from './arbeidToApiDataHelpers';

export type FrilansApiDataPart = Pick<SøknadApiData, 'frilans' | '_harHattInntektSomFrilanser' | '_frilans'>;

export const getFrilansApiData = (
    arbeidFrilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined
): FrilansApiDataPart => {
    if (!arbeidFrilansSøknadsdata) {
        return {
            _harHattInntektSomFrilanser: false,
        };
    }
    switch (arbeidFrilansSøknadsdata.type) {
        case 'pågående':
            return {
                _harHattInntektSomFrilanser: true,
                frilans: {
                    jobberFortsattSomFrilans: true,
                    startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                    arbeidsforhold: arbeidsforholdSøknadsdataToApiData(arbeidFrilansSøknadsdata.arbeidsforhold),
                },
            };
        case 'avsluttet':
            return {
                _harHattInntektSomFrilanser: true,
                frilans: {
                    jobberFortsattSomFrilans: false,
                    startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                    sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
                    arbeidsforhold: arbeidsforholdSøknadsdataToApiData(arbeidFrilansSøknadsdata.arbeidsforhold),
                },
            };
        case 'utenforSøknadsperiode':
            return {
                _harHattInntektSomFrilanser: false,
                frilans: {
                    jobberFortsattSomFrilans: false,
                    startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                    sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
                },
            };
    }
};
