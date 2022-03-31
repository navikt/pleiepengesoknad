import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType, TimerEllerProsent } from '../../../../types';
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
        timerEllerProsent: TimerEllerProsent.PROSENT,
        jobberIPerioden: YesOrNo.YES,
        jobberProsent: '20',
        erLiktHverUke: YesOrNo.YES,
    },
    erAnsatt: YesOrNo.YES,
    normalarbeidstid: {
        erLiktHverUke: YesOrNo.YES,
        timerPerUke: '10',
        fasteDager: {
            friday: { hours: '2', minutes: '2' },
        },
    },
    harFraværIPeriode: YesOrNo.YES,
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
            expect(result.arbeidIPeriode).toBeUndefined();
            expect(result.normalarbeidstid?.timerPerUke).toBeUndefined();
            expect(result.normalarbeidstid?.fasteDager).toBeUndefined();
            expect(result.harFraværIPeriode).toBeUndefined();
            expect(result.sluttetFørSøknadsperiode).toEqual(YesOrNo.YES);
            expect(result.erAnsatt).toEqual(YesOrNo.NO);
        });
    });
    describe('Når søker er ansatt i søknadsperiode', () => {
        it('Bruker er ansatt, men har ikke fravær i perioden', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                sluttetFørSøknadsperiode: YesOrNo.NO,
                harFraværIPeriode: YesOrNo.NO,
            });
            expect(result.arbeidIPeriode).toBeUndefined();
            expect(result.sluttetFørSøknadsperiode).toBeUndefined();
            expect(result.harFraværIPeriode).toEqual(YesOrNo.NO);
            expect(result.normalarbeidstid?.timerPerUke).toBeUndefined();
            expect(result.normalarbeidstid?.fasteDager).toBeDefined();
            expect(result.erAnsatt).toEqual(YesOrNo.YES);
        });
        it('Bruker er ansatt, og har fravær i perioden', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                erAnsatt: YesOrNo.YES,
                sluttetFørSøknadsperiode: YesOrNo.NO,
                harFraværIPeriode: YesOrNo.YES,
            });
            expect(result.sluttetFørSøknadsperiode).toBeUndefined();
            expect(result.arbeidIPeriode).toBeDefined();
            expect(result.normalarbeidstid?.timerPerUke).toBeUndefined();
            expect(result.normalarbeidstid?.fasteDager).toBeDefined();
            expect(result.harFraværIPeriode).toEqual(YesOrNo.YES);
            expect(result.erAnsatt).toEqual(YesOrNo.YES);
        });
        it('Hver uke er lik - beholder ukedager men fjerner snitt', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                normalarbeidstid: {
                    erLiktHverUke: YesOrNo.YES,
                    timerPerUke: '20',
                    fasteDager: {
                        monday: { hours: '1', minutes: '0' },
                    },
                },
            });
            expect(result.normalarbeidstid?.timerPerUke).toBeUndefined();
            expect(result.normalarbeidstid?.fasteDager).toBeDefined();
        });
        it('Hver uke varierer - beholder snitt med fjerner ukedager', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                normalarbeidstid: {
                    erLiktHverUke: YesOrNo.NO,
                    timerPerUke: '20',
                    fasteDager: {
                        monday: { hours: '1', minutes: '0' },
                    },
                },
            });
            expect(result.normalarbeidstid?.timerPerUke).toBeDefined();
            expect(result.normalarbeidstid?.fasteDager).toBeUndefined();
        });
    });
});
