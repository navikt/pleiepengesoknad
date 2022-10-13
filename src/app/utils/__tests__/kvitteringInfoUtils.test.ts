import { ArbeiderIPeriodenSvar } from '@navikt/sif-common-pleiepenger/lib';
import { decimalDurationToISODuration } from '@navikt/sif-common-utils/lib';
import { ArbeidIPeriodeType } from '../../types/arbeidIPeriodeType';
import { ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { Søkerdata } from '../../types/Søkerdata';
import { ArbeidsgiverApiData } from '../../types/søknad-api-data/SøknadApiData';
import { getKvitteringInfoFromApiData, KvitteringApiData } from '../kvitteringUtils';

const arbeidsgiverApiData: ArbeidsgiverApiData = {
    type: ArbeidsgiverType.ORGANISASJON,
    navn: 'abc',
    organisasjonsnummer: '213',
    erAnsatt: true,
    arbeidsforhold: {
        arbeidIPeriode: {
            type: ArbeidIPeriodeType.arbeiderIkke,
            arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær,
        },
        normalarbeidstid: {
            _erLiktSnittSomForrigeSøknad: false,
            erLiktHverUke: true,
            timerPerUkeISnitt: decimalDurationToISODuration(2),
        },
    },
    sluttetFørSøknadsperiode: false,
};

const apiData: KvitteringApiData = {
    arbeidsgivere: [],
    fraOgMed: '2021-02-02',
    tilOgMed: '2021-02-05',
};

const søkerinfo: Søkerdata = {
    søker: {
        fornavn: 'Jan',
        etternavn: 'Jansen',
    },
} as Søkerdata;

describe('kvitteringUtils', () => {
    describe('getKvitteringInfoFromApiData', () => {
        it('returnerer undefined dersom søker ikke har arbeidsgivere ', () => {
            const result = getKvitteringInfoFromApiData(apiData, søkerinfo);
            expect(result).toBeUndefined();
        });
        it('returnerer undefined dersom søker kun har arbeidsgivere hvor en sluttet før søknadsperiode ', () => {
            const arbeidsgiver: ArbeidsgiverApiData = {
                ...arbeidsgiverApiData,
                erAnsatt: false,
                sluttetFørSøknadsperiode: true,
            };
            const result = getKvitteringInfoFromApiData({ ...apiData, arbeidsgivere: [arbeidsgiver] }, søkerinfo);
            expect(result).toBeUndefined();
        });
        it('returnerer kun arbeidsgivere hvor søker ikke sluttet før søknadsperiode ', () => {
            const arbeidsgiver1: ArbeidsgiverApiData = {
                ...arbeidsgiverApiData,
                organisasjonsnummer: '1',
                erAnsatt: false,
                sluttetFørSøknadsperiode: true,
            };
            const arbeidsgiver2: ArbeidsgiverApiData = {
                ...arbeidsgiverApiData,
                organisasjonsnummer: '2',
                erAnsatt: false,
                sluttetFørSøknadsperiode: false,
                arbeidsforhold: {
                    normalarbeidstid: {
                        _erLiktSnittSomForrigeSøknad: false,
                        erLiktHverUke: true,
                        timerPerUkeISnitt: decimalDurationToISODuration(20),
                    },
                    arbeidIPeriode: {
                        type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                        arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                        prosentAvNormalt: 20,
                    },
                },
            };
            const arbeidsgiver3: ArbeidsgiverApiData = {
                ...arbeidsgiverApiData,
                organisasjonsnummer: '3',
                erAnsatt: true,
                arbeidsforhold: {
                    normalarbeidstid: {
                        _erLiktSnittSomForrigeSøknad: false,
                        erLiktHverUke: true,
                        timerPerUkeISnitt: decimalDurationToISODuration(20),
                    },
                    arbeidIPeriode: {
                        type: ArbeidIPeriodeType.arbeiderProsentAvNormalt,
                        arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                        prosentAvNormalt: 20,
                    },
                },
            };
            const arbeidsgiver4: ArbeidsgiverApiData = {
                ...arbeidsgiverApiData,
                organisasjonsnummer: '4',
                erAnsatt: false,
                sluttetFørSøknadsperiode: true,
            };
            const result = getKvitteringInfoFromApiData(
                { ...apiData, arbeidsgivere: [arbeidsgiver1, arbeidsgiver2, arbeidsgiver3, arbeidsgiver4] },
                søkerinfo
            );
            expect(result).toBeDefined();
            if (result) {
                expect(result.arbeidsgivere.length).toBe(2);
                expect(result.arbeidsgivere[0].organisasjonsnummer).toBe('2');
                expect(result.arbeidsgivere[1].organisasjonsnummer).toBe('3');
            }
        });
    });
});
