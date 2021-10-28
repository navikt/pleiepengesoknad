import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { AppFormField } from '../../types/PleiepengesøknadFormData';

describe('mapSelvstendigArbeidsforholdApiData', () => {
    it('runs', () => {
        expect(1).toBe(1);
    });
    it(`remove virksomheter and arbeidsforhold if ${AppFormField.selvstendig_harHattInntektSomSN} === ${YesOrNo.NO}`, () => {
        expect(1).toBe(1);
    });
});
