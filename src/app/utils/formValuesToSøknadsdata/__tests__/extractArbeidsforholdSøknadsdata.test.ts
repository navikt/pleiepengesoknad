import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType, TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormData, ArbeiderIPeriodenSvar } from '../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData } from '../../../types/ArbeidsforholdFormData';
import { extractArbeidsforholdSøknadsdata } from '../extractArbeidsforholdSøknadsdata';

const søknadsperiode = ISODateRangeToDateRange('2022-01-01/2022-02-01');
const mockArbeidIPeriodeFormData = {} as ArbeidIPeriodeFormData;

describe('extractArbeidsforholdSøknadsdata', () => {
    const arbeidsforholdMedFravær: ArbeidsforholdFormData = {
        arbeidsgiver: { type: ArbeidsgiverType.ORGANISASJON, navn: 'Org1', id: '1' },
        erAnsatt: YesOrNo.YES,
        arbeidIPeriode: mockArbeidIPeriodeFormData,
        normalarbeidstid: {
            erLikeMangeTimerHverUke: YesOrNo.YES,
            erFasteUkedager: YesOrNo.YES,
            timerFasteUkedager: { monday: { hours: '1', minutes: '30' } },
        },
    };
    it('returnerer undefined dersom normalarbeidstid er ugyldig', () => {
        const result = extractArbeidsforholdSøknadsdata(
            { ...arbeidsforholdMedFravær, normalarbeidstid: undefined },
            søknadsperiode
        );
        expect(result).toBeUndefined();
    });
    it('returnerer arbeidsforhold korrekt når arbeidIPeriode ikke er satt', () => {
        const result = extractArbeidsforholdSøknadsdata(
            { ...arbeidsforholdMedFravær, arbeidIPeriode: undefined },
            søknadsperiode
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
                    erLiktHverUke: YesOrNo.NO,
                    timerPerUke: '20',
                    timerEllerProsent: TimerEllerProsent.TIMER,
                },
            },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.normalarbeidstid).toBeDefined();
        expect(result?.arbeidISøknadsperiode).toBeDefined();
    });
});
