import { ArbeidsgiverApiData } from '../../types/SøknadApiData';
import { Arbeidsgiver, Søkerdata } from '../../types/Søkerdata';
import { getKvitteringInfoFromApiData, KvitteringApiData } from '../kvitteringUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';

const arbeidsgiverInfo: Arbeidsgiver = {
    navn: 'abc',
    organisasjonsnummer: '123',
};

const apiData: KvitteringApiData = {
    arbeidsgivere: [],
    fraOgMed: '2021-02-02',
    tilOgMed: '2021-02-05',
};

const søkerinfo: Søkerdata = {
    person: {
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
                ...arbeidsgiverInfo,
                erAnsatt: false,
                sluttetFørSøknadsperiode: true,
            };
            const result = getKvitteringInfoFromApiData({ ...apiData, arbeidsgivere: [arbeidsgiver] }, søkerinfo);
            expect(result).toBeUndefined();
        });
        it('returnerer kun arbeidsgivere hvor søker ikke sluttet før søknadsperiode ', () => {
            const arbeidsgiver1: ArbeidsgiverApiData = {
                ...arbeidsgiverInfo,
                organisasjonsnummer: '1',
                erAnsatt: false,
                sluttetFørSøknadsperiode: true,
            };
            const arbeidsgiver2: ArbeidsgiverApiData = {
                ...arbeidsgiverInfo,
                organisasjonsnummer: '2',
                erAnsatt: false,
                sluttetFørSøknadsperiode: false,
                arbeidsforhold: {
                    jobberNormaltTimer: 20,
                    _type: ArbeidsforholdType.ANSATT,
                },
            };
            const arbeidsgiver3: ArbeidsgiverApiData = {
                ...arbeidsgiverInfo,
                organisasjonsnummer: '3',
                erAnsatt: true,
                arbeidsforhold: {
                    jobberNormaltTimer: 20,
                    _type: ArbeidsforholdType.ANSATT,
                },
            };
            const arbeidsgiver4: ArbeidsgiverApiData = {
                ...arbeidsgiverInfo,
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
