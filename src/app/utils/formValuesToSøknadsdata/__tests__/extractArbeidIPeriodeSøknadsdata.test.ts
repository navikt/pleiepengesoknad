import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeiderIPeriodenSvar } from '../../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeType } from '../../../types/Søknadsdata';
import { extractArbeidIPeriodeSøknadsdata } from '../extractArbeidIPeriodeSøknadsdata';

const søknadsperiode = ISODateRangeToDateRange('2022-01-01/2022-02-01');

describe('extractArbeidIPeriodeSøknadsdata', () => {
    it('returnerer riktig når en ikke jobber i perioden', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            { arbeiderIPerioden: ArbeiderIPeriodenSvar.heltFravær },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderIkke);
        expect(result?.arbeiderIPerioden).toBeFalsy();
    });
    it('returnerer riktig når en jobber som vanlig i perioden', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            { arbeiderIPerioden: ArbeiderIPeriodenSvar.somVanlig },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderVanlig);
        expect(result?.arbeiderIPerioden).toBeTruthy();
        expect((result as any).arbeiderRedusert).toBeFalsy();
    });
    it('returnerer riktig når en arbeider prosent av normalt', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                erLiktHverUke: undefined,
                timerEllerProsent: TimerEllerProsent.PROSENT,
                prosentAvNormalt: '50',
                timerPerUke: '213',
            },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderProsentAvNormalt);
        expect(result?.arbeiderIPerioden).toBeTruthy();
        expect((result as any).arbeiderRedusert).toBeTruthy();
        expect((result as any).prosentAvNormalt).toEqual(50);
    });
    it('returnerer riktig når en arbeider timer i snitt per uke', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                erLiktHverUke: undefined,
                timerEllerProsent: TimerEllerProsent.TIMER,
                prosentAvNormalt: '50',
                timerPerUke: '20',
            },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderTimerISnittPerUke);
        expect(result?.arbeiderIPerioden).toBeTruthy();
        expect((result as any).arbeiderRedusert).toBeTruthy();
        expect((result as any).timerISnittPerUke).toEqual(20);
    });
    it('returnerer riktig for like uker og arbeid oppgitt i faste dager', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                erLiktHverUke: YesOrNo.YES,
                fasteDager: { monday: { hours: '1', minutes: '30' } },
                timerEllerProsent: undefined,
                prosentAvNormalt: '50',
                timerPerUke: '20',
            },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderFasteUkedager);
        expect(result?.arbeiderIPerioden).toBeTruthy();
        expect((result as any).arbeiderRedusert).toBeTruthy();
        expect((result as any).fasteDager).toBeDefined();
    });
    it('returnerer riktig når en arbeider enkeltdager', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            {
                arbeiderIPerioden: ArbeiderIPeriodenSvar.redusert,
                erLiktHverUke: YesOrNo.NO,
                fasteDager: { monday: { hours: '1', minutes: '30' } },
                enkeltdager: { '2020-01-01': { hours: '1', minutes: '10' } },
                timerEllerProsent: undefined,
                prosentAvNormalt: '50',
                timerPerUke: '20',
            },
            søknadsperiode
        );
        expect(result).toBeDefined();
        expect(result?.type).toEqual(ArbeidIPeriodeType.arbeiderEnkeltdager);
        expect(result?.arbeiderIPerioden).toBeTruthy();
        expect((result as any).arbeiderRedusert).toBeTruthy();
        expect((result as any).enkeltdager).toBeDefined();
    });
});
