import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { ArbeidsgiverType, JobberIPeriodeSvar, TimerEllerProsent } from '../../../../types';
import { Arbeidsforhold } from '../../../../types/Arbeidsforhold';
import { cleanupAnsattArbeidsforhold } from '../cleanupArbeidssituasjonStep';

const ansattArbeidsforhold: Arbeidsforhold = {
    arbeidsgiver: {
        type: ArbeidsgiverType.ORGANISASJON,
        organisasjonsnummer: '123456789',
        id: '123',
        navn: 'Arbeidsgiver',
        ansattFom: ISODateToDate('2010-01-01'),
    },
    arbeidIPeriode: {
        timerEllerProsent: TimerEllerProsent.PROSENT,
        jobberIPerioden: JobberIPeriodeSvar.JA,
        jobberProsent: '20',
        erLiktHverUke: YesOrNo.YES,
    },
    erAnsatt: YesOrNo.YES,
    harFraværIPeriode: YesOrNo.YES,
    jobberNormaltTimer: '10',
    sluttetFørSøknadsperiode: YesOrNo.NO,
};

describe('cleanupAnsattArbeidsforhold', () => {
    describe('Når søker sier at en har sluttet før søknadsperiode', () => {
        it('Beholder kun nødvendig informasjon', () => {
            const result = cleanupAnsattArbeidsforhold({
                ...ansattArbeidsforhold,
                erAnsatt: YesOrNo.NO,
                sluttetFørSøknadsperiode: YesOrNo.YES,
            });
            expect(result.arbeidIPeriode).toBeUndefined();
            expect(result.jobberNormaltTimer).toBeUndefined();
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
            expect(result.jobberNormaltTimer).toBeDefined();
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
            expect(result.jobberNormaltTimer).toBeDefined();
            expect(result.harFraværIPeriode).toEqual(YesOrNo.YES);
            expect(result.erAnsatt).toEqual(YesOrNo.YES);
        });
    });
});
