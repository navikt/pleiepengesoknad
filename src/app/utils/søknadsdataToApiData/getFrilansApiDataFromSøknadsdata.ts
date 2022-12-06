import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { FrilansTyper } from '../../types/FrilansFormData';
import { FrilansApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidFrilansSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdFrilansApiDataFromSøknadsdata } from './getArbeidsforholdApiDataFromSøknadsdata';

export const getFrilansApiDataFromSøknadsdata = (
    arbeidFrilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined
): FrilansApiData => {
    if (!arbeidFrilansSøknadsdata || arbeidFrilansSøknadsdata.type === 'erIkkeFrilanser') {
        return {
            type: 'ingenIntekt',
            harInntektSomFrilanser: false,
        };
    }

    switch (arbeidFrilansSøknadsdata.type) {
        case 'pågående':
            return {
                type: 'harArbeidsforhold',
                harInntektSomFrilanser: true,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                frilansTyper: arbeidFrilansSøknadsdata.frilansType,
                misterHonorar: arbeidFrilansSøknadsdata.misterHonorar
                    ? arbeidFrilansSøknadsdata.misterHonorar === YesOrNo.YES
                        ? true
                        : false
                    : undefined,
                arbeidsforhold: getArbeidsforholdFrilansApiDataFromSøknadsdata(arbeidFrilansSøknadsdata.arbeidsforhold),
            };
        case 'pågåendeKunStyreverv':
            return {
                type: 'harIkkeArbeidsforhold',
                harInntektSomFrilanser: true,
                frilansTyper: [FrilansTyper.STYREVERV],
                misterHonorar: false,
            };
    }
};
