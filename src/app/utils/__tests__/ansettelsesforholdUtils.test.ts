import { Ansettelsesforhold } from 'app/types/Søkerdata';
import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { syncAnsettelsesforholdInFormDataWithSøkerdata } from '../ansettelsesforholdUtils';
import { YesOrNo } from 'common/types/YesOrNo';

const organisasjoner: Ansettelsesforhold[] = [
    { navn: 'Org1', organisasjonsnummer: '1' },
    { navn: 'Org2', organisasjonsnummer: '2' }
];

const organisasjonerPartiallyEqual: Ansettelsesforhold[] = [
    { navn: 'Org3', organisasjonsnummer: '3' },
    { navn: 'NewOrg', organisasjonsnummer: 'new' }
];

const organisasjonerEqual: Ansettelsesforhold[] = [
    { navn: 'Org3', organisasjonsnummer: '3' },
    { navn: 'Org4', organisasjonsnummer: '4' }
];

const ansettelsesforhold: AnsettelsesforholdForm[] = [
    { navn: 'Org3', organisasjonsnummer: '3', erAnsattIPerioden: YesOrNo.YES },
    { navn: 'Org4', organisasjonsnummer: '4', erAnsattIPerioden: YesOrNo.UNANSWERED }
];

describe('ansettelsesforholdUtils', () => {
    describe('syncAnsettelsesforholdInFormDataWithSøkerdata', () => {
        it('should replace all ansettelsesforhold if none present in organisasjoner', () => {
            const result = syncAnsettelsesforholdInFormDataWithSøkerdata(organisasjoner, ansettelsesforhold);
            expect(JSON.stringify(result)).toEqual(JSON.stringify(organisasjoner));
        });

        it('should keep those ansettelsesforhold which still are present in organisasjoner', () => {
            const result = syncAnsettelsesforholdInFormDataWithSøkerdata(
                organisasjonerPartiallyEqual,
                ansettelsesforhold
            );
            expect(result[0].organisasjonsnummer).toBe('3');
            expect(result[0].erAnsattIPerioden).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('new');
        });

        it('should keep all ansettelsesforhold when all are present in organisasjoner', () => {
            const result = syncAnsettelsesforholdInFormDataWithSøkerdata(organisasjonerEqual, ansettelsesforhold);
            expect(result[0].organisasjonsnummer).toBe('3');
            expect(result[0].erAnsattIPerioden).toBe(YesOrNo.YES);
            expect(result[1].organisasjonsnummer).toBe('4');
            expect(result[1].erAnsattIPerioden).toBe(YesOrNo.UNANSWERED);
        });
    });
});
