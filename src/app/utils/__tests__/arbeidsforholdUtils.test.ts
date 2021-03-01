import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { Arbeidsforhold } from '../../types/PleiepengesøknadFormData';
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

const arbeidsforhold: Arbeidsforhold[] = [
    { navn: 'Org3', organisasjonsnummer: '3', erAnsattIPerioden: YesOrNo.YES, jobberNormaltTimer: '10' },
    { navn: 'Org4', organisasjonsnummer: '4', erAnsattIPerioden: YesOrNo.UNANSWERED, jobberNormaltTimer: '20' },
];

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
            expect(result[0].erAnsattIPerioden).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('new');
        });

        it('should keep all arbeidsforhold when all are present in arbeidsgivere', () => {
            const result = syncArbeidsforholdWithArbeidsgivere(organisasjonerEqual, arbeidsforhold);
            expect(result[0].organisasjonsnummer).toBe('3');
            expect(result[0].erAnsattIPerioden).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('4');
            expect(result[1].erAnsattIPerioden).toBe(YesOrNo.UNANSWERED);
        });
    });
});
