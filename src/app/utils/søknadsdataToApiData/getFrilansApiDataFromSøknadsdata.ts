import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { MisterHonorarerFraVervIPerioden } from 'app/types/ArbeidIPeriodeFormValues';
import { FrilansTyper } from '../../types/FrilansFormData';
import { FrilansApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidFrilansSøknadsdata } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdFrilansApiDataFromSøknadsdata } from './getArbeidsforholdApiDataFromSøknadsdata';
import { ArbeidIPeriodeFrilansSøknadsdata } from '../../types/søknadsdata/arbeidIPeriodeFrilansSøknadsdata';

export const getFrilansApiDataFromSøknadsdata = (
    arbeidFrilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined
): FrilansApiData => {
    if (!arbeidFrilansSøknadsdata || arbeidFrilansSøknadsdata.type === 'erIkkeFrilanser') {
        return {
            type: 'ingenIntekt',
            harInntektSomFrilanser: false,
        };
    }
    const getMisterHonorarerIPerioden = (
        arbeidIPeriodeFrilans: ArbeidIPeriodeFrilansSøknadsdata
    ): MisterHonorarerFraVervIPerioden | undefined => arbeidIPeriodeFrilans.misterHonorarerFraVervIPerioden;

    switch (arbeidFrilansSøknadsdata.type) {
        case 'pågående':
            return {
                type: 'harArbeidsforhold',
                harInntektSomFrilanser: true,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                frilansTyper: arbeidFrilansSøknadsdata.frilansType,
                misterHonorarer: arbeidFrilansSøknadsdata.misterHonorar
                    ? arbeidFrilansSøknadsdata.misterHonorar === YesOrNo.YES
                        ? true
                        : false
                    : undefined,
                misterHonorarerIPerioden: getMisterHonorarerIPerioden(
                    arbeidFrilansSøknadsdata.arbeidsforhold.arbeidISøknadsperiode as ArbeidIPeriodeFrilansSøknadsdata
                ),
                arbeidsforhold: getArbeidsforholdFrilansApiDataFromSøknadsdata(arbeidFrilansSøknadsdata.arbeidsforhold),
            };
        case 'pågåendeKunStyreverv':
            return {
                type: 'harIkkeArbeidsforhold',
                harInntektSomFrilanser: true,
                frilansTyper: [FrilansTyper.STYREVERV],
                misterHonorarer: false,
            };
    }
};
