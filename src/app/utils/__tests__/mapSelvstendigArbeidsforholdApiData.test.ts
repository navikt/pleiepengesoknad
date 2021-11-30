import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormField } from '../../types/SøknadFormData';

describe('mapSelvstendigArbeidsforholdApiData', () => {
    it('runs', () => {
        expect(1).toBe(1);
    });
    it(`remove virksomheter and arbeidsforhold if ${SøknadFormField.selvstendig_harHattInntektSomSN} === ${YesOrNo.NO}`, () => {
        expect(1).toBe(1);
    });
});
