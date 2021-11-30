import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeidsforholdAnsatt } from '../../types/SøknadFormData';
import { Arbeidsgiver } from '../../types/Søkerdata';
import { syncArbeidsforholdWithArbeidsgivere } from '../arbeidsforholdUtils';

const organisasjoner: Arbeidsgiver[] = [
    { navn: 'Org1', organisasjonsnummer: '1' },
    { navn: 'Org2', organisasjonsnummer: '2' },
];

const organisasjonerPartiallyEqual: Arbeidsgiver[] = [
    { navn: 'Org3', organisasjonsnummer: '3' },
    { navn: 'NewOrg', organisasjonsnummer: 'new' },
];

const organisasjonerEqual: Arbeidsgiver[] = [
    { navn: 'Org3', organisasjonsnummer: '3' },
    { navn: 'Org4', organisasjonsnummer: '4' },
];

const arbeidsforholdErAnsatt: ArbeidsforholdAnsatt = {
    navn: 'Org3',
    organisasjonsnummer: '3',
    erAnsatt: YesOrNo.YES,
    jobberNormaltTimer: '10',
};

const arbeidsforholdUbesvart: ArbeidsforholdAnsatt = {
    navn: 'Org4',
    organisasjonsnummer: '4',
    erAnsatt: YesOrNo.UNANSWERED,
    jobberNormaltTimer: '20',
};

const arbeidsforhold: ArbeidsforholdAnsatt[] = [arbeidsforholdErAnsatt, arbeidsforholdUbesvart];

jest.mock('./../envUtils', () => {
    return {
        getEnvironmentVariable: () => 'someEnvVar',
    };
});

describe('arbeidsforholdUtils', () => {
    describe('syncArbeidsforholdWithArbeidsgivere', () => {
        it('should replace all arbeidsforhold if none present in arbeidsgivere', () => {
            const result = syncArbeidsforholdWithArbeidsgivere(organisasjoner, arbeidsforhold);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(organisasjoner));
        });

        it('should keep those arbeidsforhold which still are present in arbeidsgivere', () => {
            const result = syncArbeidsforholdWithArbeidsgivere(organisasjonerPartiallyEqual, arbeidsforhold);
            expect(result[0].organisasjonsnummer).toBe('3');
            expect(result[0].erAnsatt).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('new');
        });

        it('should keep all arbeidsforhold when all are present in arbeidsgivere', () => {
            const result = syncArbeidsforholdWithArbeidsgivere(organisasjonerEqual, arbeidsforhold);
            expect(result[0].organisasjonsnummer).toBe('3');
            expect(result[0].erAnsatt).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('4');
            expect(result[1].erAnsatt).toBe(YesOrNo.UNANSWERED);
        });
    });
});
