import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../types';
import { ArbeidIPeriodeFormData } from '../../../types/ArbeidIPeriodeFormData';
import { NormalarbeidstidSøknadsdata } from '../../../types/Søknadsdata';
import { extractArbeidIPeriodeSøknadsdata } from '../extractArbeidIPeriodeSøknadsdata';

const søknadsperiode = ISODateRangeToDateRange('2022-01-01/2022-02-01');

const normalarbeidstid: NormalarbeidstidSøknadsdata = {
    erLiktHverUke: true,
    fasteDager: { monday: { hours: '5', minutes: '0' }, tuesday: { hours: '5', minutes: '0' } },
    timerPerUke: 10,
};

const arbeidIPeriode: ArbeidIPeriodeFormData = {
    jobberIPerioden: YesOrNo.UNANSWERED,
    jobberProsent: '50',
    erLiktHverUke: YesOrNo.YES,
    timerEllerProsent: TimerEllerProsent.PROSENT,
};

const arbeiderIkke: ArbeidIPeriodeFormData = {
    ...arbeidIPeriode,
    jobberIPerioden: YesOrNo.NO,
};

const arbeidFastProsent: ArbeidIPeriodeFormData = {
    ...arbeidIPeriode,
    jobberIPerioden: YesOrNo.YES,
};

const arbeidFasteDager: ArbeidIPeriodeFormData = {
    ...arbeidIPeriode,
    jobberIPerioden: YesOrNo.YES,
    timerEllerProsent: TimerEllerProsent.TIMER,
    fasteDager: { monday: { hours: '1', minutes: '30' } },
};

const arbeidVariert: ArbeidIPeriodeFormData = {
    ...arbeidIPeriode,
    jobberIPerioden: YesOrNo.YES,
    erLiktHverUke: YesOrNo.NO,
    enkeltdager: {
        '2022-01-03': {
            hours: '1',
            minutes: '30',
        },
    },
};

describe('extractArbeidIPeriodeSøknadsdata', () => {
    it('returnerer undefined dersom arbeidstid er lik hver uke, men tillegsdata mangler', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            { ...arbeidFastProsent, fasteDager: undefined, jobberProsent: undefined },
            normalarbeidstid,
            søknadsperiode
        );
        expect(result).toBeUndefined();
    });
    it('returnerer undefined dersom arbeidstid varierer, men enkeltdager mangler', () => {
        const result = extractArbeidIPeriodeSøknadsdata(
            { ...arbeidVariert, enkeltdager: undefined },
            normalarbeidstid,
            søknadsperiode
        );
        expect(result).toBeUndefined();
    });
    it('returnerer riktig når en ikke jobber i perioden', () => {
        const result = extractArbeidIPeriodeSøknadsdata(arbeiderIkke, normalarbeidstid, søknadsperiode);
        expect(result).toBeDefined();
        expect(result?.type).toEqual('arbeiderIkkeIPerioden');
        expect((result as any).arbeiderIPerioden).toBeUndefined();
        expect((result as any).erLiktHverUke).toBeUndefined();
        expect((result as any).fasteDager).toBeUndefined();
        expect((result as any).jobberProsent).toBeUndefined();
    });
    it('returnerer riktig for like uker og arbeid oppgitt i prosent', () => {
        const result = extractArbeidIPeriodeSøknadsdata(arbeidFastProsent, normalarbeidstid, søknadsperiode);
        expect(result).toBeDefined();
        expect(result?.type).toEqual('fastProsent');
        if (result?.type === 'fastProsent') {
            expect(result.arbeiderIPerioden).toBeTruthy();
            expect(result.erLiktHverUke).toBeTruthy();
            expect(result.fasteDager).toBeDefined();
            expect(result.jobberProsent).toEqual(50);
        }
    });
    it('returnerer riktig for like uker og arbeid oppgitt i faste dager', () => {
        const result = extractArbeidIPeriodeSøknadsdata(arbeidFasteDager, normalarbeidstid, søknadsperiode);
        expect(result).toBeDefined();
        expect(result?.type).toEqual('fasteDager');
        if (result?.type === 'fasteDager') {
            expect(result.arbeiderIPerioden).toBeTruthy();
            expect(result.erLiktHverUke).toBeTruthy();
            expect(result.fasteDager).toBeDefined();
            expect((result as any).jobberProsent).toBeUndefined();
        }
    });
    it('returnerer riktig når det varierer', () => {
        const result = extractArbeidIPeriodeSøknadsdata(arbeidVariert, normalarbeidstid, søknadsperiode);
        expect(result).toBeDefined();
        expect(result?.type).toEqual('variert');
        if (result?.type === 'variert') {
            expect(result.arbeiderIPerioden).toBeTruthy();
            expect(result.erLiktHverUke).toBeFalsy();
            expect(result.enkeltdager).toBeDefined();
            expect((result as any).fasteDager).toBeUndefined();
            expect((result as any).jobberProsent).toBeUndefined();
        }
    });
});
