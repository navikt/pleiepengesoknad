import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ArbeiderIPeriodenSvar, ArbeidsforholdType } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidsgiverType, TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormData } from '../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData } from '../../../types/ArbeidsforholdFormData';
import { extractArbeidsforholdSøknadsdata } from '../extractArbeidsforholdSøknadsdata';

const mockArbeidIPeriodeFormData = {} as ArbeidIPeriodeFormData;

describe('extractArbeidsforholdSøknadsdata', () => {
    const arbeidsforholdMedFravær: ArbeidsforholdFormData = {
        arbeidsgiver: { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org1', id: '1' },
        erAnsatt: YesOrNo.YES,
        arbeidIPeriode: mockArbeidIPeriodeFormData,
        normalarbeidstid: {
            timerPerUke: '20',
        },
    };
    it('returnerer undefined dersom normalarbeidstid er ugyldig', () => {
        const result = extractArbeidsforholdSøknadsdata(
            { ...arbeidsforholdMedFravær, normalarbeidstid: undefined },
            ArbeidsforholdType.ANSATT
        );
        expect(result).toBeUndefined();
    });
    it('returnerer arbeidsforhold korrekt når arbeidIPeriode ikke er satt', () => {
        const result = extractArbeidsforholdSøknadsdata(
            { ...arbeidsforholdMedFravær, arbeidIPeriode: undefined },
            ArbeidsforholdType.ANSATT
        );
        expect(result).toBeDefined();
        expect(result?.normalarbeidstid).toBeDefined();
        expect(result?.arbeidISøknadsperiode).toBeUndefined();
    });
    it('returnerer arbeidsforhold korrekt når arbeidIPeriode er satt', () => {
        const result = extractArbeidsforholdSøknadsdata(
            {
                ...arbeidsforholdMedFravær,
                arbeidIPeriode: {
                    arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                    timerPerUke: '20',
                    timerEllerProsent: TimerEllerProsent.TIMER,
                },
            },
            ArbeidsforholdType.ANSATT
        );
        expect(result).toBeDefined();
        expect(result?.normalarbeidstid).toBeDefined();
        expect(result?.arbeidISøknadsperiode).toBeDefined();
    });
});
