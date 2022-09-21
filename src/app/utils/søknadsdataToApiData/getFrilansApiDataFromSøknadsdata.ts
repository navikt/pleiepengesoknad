import { DateRange } from '@navikt/sif-common-formik/lib';
import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { FrilansApiData } from '../../types/søknad-api-data/SøknadApiData';
import { ArbeidFrilansSøknadsdata, ArbeidFrilansSøknadsdataType } from '../../types/søknadsdata/Søknadsdata';
import { getArbeidsforholdApiDataFromSøknadsdata } from './arbeidToApiDataHelpers';

export const getFrilansApiDataFromSøknadsdata = (
    arbeidFrilansSøknadsdata: ArbeidFrilansSøknadsdata | undefined,
    søknadsperiode: DateRange
): FrilansApiData => {
    if (!arbeidFrilansSøknadsdata || arbeidFrilansSøknadsdata.type === 'erIkkeFrilanser') {
        return {
            harInntektSomFrilanser: false,
        };
    }

    switch (arbeidFrilansSøknadsdata.type) {
        case ArbeidFrilansSøknadsdataType.pågående:
            return {
                harInntektSomFrilanser: true,
                jobberFortsattSomFrilans: true,
                mottarFosterhjemsgodtgjørelse: arbeidFrilansSøknadsdata.mottarFosterhjemsgodtgjørelse,
                harAndreOppdragEnnFosterhjemsgodtgjørelse:
                    arbeidFrilansSøknadsdata.harAndreOppdragEnnFosterhjemsgodtgjørelse,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(
                    arbeidFrilansSøknadsdata.arbeidsforhold,
                    søknadsperiode,
                    { from: arbeidFrilansSøknadsdata.startdato, to: søknadsperiode.to }
                ),
            };
        case ArbeidFrilansSøknadsdataType.kunFosterhjemsgodtgjørelse:
            return {
                harInntektSomFrilanser: true,
                mottarFosterhjemsgodtgjørelse: true,
                harAndreOppdragEnnFosterhjemsgodtgjørelse: false,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
            };
        case ArbeidFrilansSøknadsdataType.avsluttetISøknadsperiode:
            return {
                harInntektSomFrilanser: true,
                jobberFortsattSomFrilans: false,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
                mottarFosterhjemsgodtgjørelse: arbeidFrilansSøknadsdata.mottarFosterhjemsgodtgjørelse,
                harAndreOppdragEnnFosterhjemsgodtgjørelse:
                    arbeidFrilansSøknadsdata.harAndreOppdragEnnFosterhjemsgodtgjørelse,
                arbeidsforhold: getArbeidsforholdApiDataFromSøknadsdata(
                    arbeidFrilansSøknadsdata.arbeidsforhold,
                    søknadsperiode,
                    { from: arbeidFrilansSøknadsdata.startdato, to: arbeidFrilansSøknadsdata.sluttdato }
                ),
            };
        case ArbeidFrilansSøknadsdataType.avsluttetFørSøknadsperiode:
            return {
                harInntektSomFrilanser: false,
                jobberFortsattSomFrilans: false,
                startdato: dateToISODate(arbeidFrilansSøknadsdata.startdato),
                sluttdato: dateToISODate(arbeidFrilansSøknadsdata.sluttdato),
            };
    }
};
