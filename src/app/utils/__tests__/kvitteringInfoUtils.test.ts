import { JobberIPeriodeSvar } from '../../types';
import { ArbeidsgiverType } from '../../types/Arbeidsgiver';
import { Søkerdata } from '../../types/Søkerdata';
import { ArbeidsgiverApiData } from '../../types/SøknadApiData';
import { getKvitteringInfoFromApiData, KvitteringApiData } from '../kvitteringUtils';

const arbeidsgiverApiData: ArbeidsgiverApiData = {
    type: ArbeidsgiverType.ORGANISASJON,
    navn: 'abc',
    organisasjonsnummer: '213',
    erAnsatt: true,
    arbeidsforhold: {
        arbeidIPeriode: {
            jobberIPerioden: JobberIPeriodeSvar.NEI,
        },
        harFraværIPeriode: true,
        normalarbeidstid: {
            erLiktHverUke: false,
            timerPerUke: 2,
            timerFasteDager: {
                mandag: 'PT4H0M',
                tirsdag: 'PT4H0M',
                onsdag: 'PT4H0M',
                torsdag: 'PT4H0M',
                fredag: 'PT4H0M',
            },
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
                        erLiktHverUke: false,
                        timerPerUke: 20,
                        timerFasteDager: {
                            mandag: 'PT4H0M',
                            tirsdag: 'PT4H0M',
                            onsdag: 'PT4H0M',
                            torsdag: 'PT4H0M',
                            fredag: 'PT4H0M',
                        },
                    },
                    harFraværIPeriode: true,
                    arbeidIPeriode: {
                        jobberIPerioden: JobberIPeriodeSvar.JA,
                    },
                },
            };
            const arbeidsgiver3: ArbeidsgiverApiData = {
                ...arbeidsgiverApiData,
                organisasjonsnummer: '3',
                erAnsatt: true,
                arbeidsforhold: {
                    normalarbeidstid: {
                        erLiktHverUke: false,
                        timerPerUke: 20,
                        timerFasteDager: {
                            mandag: 'PT4H0M',
                            tirsdag: 'PT4H0M',
                            onsdag: 'PT4H0M',
                            torsdag: 'PT4H0M',
                            fredag: 'PT4H0M',
                        },
                    },
                    harFraværIPeriode: true,
                    arbeidIPeriode: {
                        jobberIPerioden: JobberIPeriodeSvar.JA,
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
