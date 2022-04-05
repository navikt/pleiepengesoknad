import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType, TimerEllerProsent } from '../../../../types';
import { ArbeiderIPeriodenSvar } from '../../../../types/ArbeidIPeriodeFormData';
import { ArbeidsforholdFormData } from '../../../../types/ArbeidsforholdFormData';
import { cleanupAnsattArbeidsforhold } from '../cleanupArbeidssituasjonStep';

const ansattArbeidsforhold: ArbeidsforholdFormData = {
    arbeidsgiver: {
        type: ArbeidsgiverType.ORGANISASJON,
        organisasjonsnummer: '123456789',
        id: '123',
        navn: 'Arbeidsgiver',
        ansattFom: ISODateToDate('2010-01-01'),
    },
    arbeidIPeriode: {
        arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
        timerEllerProsent: TimerEllerProsent.PROSENT,
        timerPerUke: '20',
        erLiktHverUke: YesOrNo.YES,
    },
    erAnsatt: YesOrNo.YES,
    normalarbeidstid: {
        erLikeMangeTimerHverUke: YesOrNo.YES,
        timerPerUke: '10',
        timerFasteUkedager: {
            friday: { hours: '2', minutes: '2' },
        },
    },
    sluttetFørSøknadsperiode: YesOrNo.NO,
};

describe('cleanupAnsattArbeidsforhold', () => {
    describe('Når søker sier at en har sluttet før søknadsperiode', () => {
        it('Beholder kun nødvendig informasjon når bruker ikke er ansatt', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                erAnsatt: YesOrNo.NO,
                sluttetFørSøknadsperiode: YesOrNo.YES,
            });
            expect(result.sluttetFørSøknadsperiode).toEqual(YesOrNo.YES);
            expect(result.normalarbeidstid).toBeUndefined();
            expect(result.arbeidIPeriode).toBeUndefined();
            expect(result.erAnsatt).toEqual(YesOrNo.NO);
        });
    });
    describe('Når søker er ansatt i søknadsperiode', () => {
        it('Bruker er ansatt i hele søknadsperioden', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                sluttetFørSøknadsperiode: YesOrNo.NO,
            });
            expect(result.arbeidIPeriode).toBeDefined();
            expect(result.normalarbeidstid).toBeDefined();
            expect(result.arbeidsgiver).toBeDefined();
            expect(result.erAnsatt).toEqual(YesOrNo.YES);
            expect(result.sluttetFørSøknadsperiode).toBeUndefined();
        });
        it('Bruker er ikke lenger ansatt men slutter i søknadsperioden', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                erAnsatt: YesOrNo.NO,
                sluttetFørSøknadsperiode: YesOrNo.NO,
            });
            expect(result.erAnsatt).toEqual(YesOrNo.NO);
            expect(result.sluttetFørSøknadsperiode).toEqual(YesOrNo.NO);
            expect(result.arbeidIPeriode).toBeDefined();
            expect(result.normalarbeidstid).toBeDefined();
            expect(result.arbeidsgiver).toBeDefined();
        });
    });
});
