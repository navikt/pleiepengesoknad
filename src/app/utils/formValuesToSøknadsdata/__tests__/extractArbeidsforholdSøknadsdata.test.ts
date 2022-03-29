import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType } from '../../../types';
import { ArbeidIPeriodeFormData } from '../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData } from '../../../types/ArbeidsforholdFormData';
import { ArbeidsforholdSøknadsdataMedFravær } from '../../../types/Søknadsdata';
import { extractArbeidsforholdSøknadsdata } from '../extractArbeidsforholdSøknadsdata';

const søknadsperiode = ISODateRangeToDateRange('2022-01-01/2022-02-01');
const mockArbeidIPeriodeFormData = {} as ArbeidIPeriodeFormData;

describe('extractArbeidsforholdSøknadsdata', () => {
    const arbeidsforholdMedFravær: ArbeidsforholdFormData = {
        arbeidsgiver: { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org1', id: '1' },
        erAnsatt: YesOrNo.YES,
        harFraværIPeriode: YesOrNo.YES,
        arbeidIPeriode: mockArbeidIPeriodeFormData,
        normalarbeidstid: {
            erLiktHverUke: YesOrNo.YES,
            fasteDager: { monday: { hours: '1', minutes: '30' } },
        },
    };
    it('returnerer undefined dersom normalarbeidstid er ugyldig', () => {
        const result = extractArbeidsforholdSøknadsdata(
            { ...arbeidsforholdMedFravær, normalarbeidstid: undefined },
            søknadsperiode
        );
        expect(result).toBeUndefined();
    });
    it('returnerer undefined dersom harFraværIPeriode er undefined/ubesvart', () => {
        const result = extractArbeidsforholdSøknadsdata(
            { ...arbeidsforholdMedFravær, harFraværIPeriode: YesOrNo.UNANSWERED },
            søknadsperiode
        );
        expect(result).toBeUndefined();
    });
    it('returnerer arbeidsforhold med fravær', () => {
        const result = extractArbeidsforholdSøknadsdata(arbeidsforholdMedFravær, søknadsperiode);
        expect(result).toBeDefined();
        expect(result?.harFraværIPeriode).toBeTruthy();
        expect(result?.normalarbeidstid).toBeDefined();
        expect((result as ArbeidsforholdSøknadsdataMedFravær)?.arbeidISøknadsperiode).toBeDefined();
    });
    it('returnerer arbeidsforhold uten fravær', () => {
        const result = extractArbeidsforholdSøknadsdata(
            { ...arbeidsforholdMedFravær, harFraværIPeriode: YesOrNo.NO, arbeidIPeriode: undefined },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.harFraværIPeriode).toBeFalsy();
        expect(result?.normalarbeidstid).toBeDefined();
        expect((result as ArbeidsforholdSøknadsdataMedFravær)?.arbeidISøknadsperiode).toBeUndefined();
    });
});
