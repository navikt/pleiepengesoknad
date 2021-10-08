import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { JobberIPeriodeSvar } from '../../../types';
import { ArbeidIPeriodeApiData } from '../../../types/PleiepengesøknadApiData';
import { ArbeidIPeriode } from '../../../types/PleiepengesøknadFormData';
import {
    getHistoriskArbeidIArbeidsforhold,
    getPlanlagtArbeidIArbeidsforhold,
    mapArbeidIPeriodeToApiData,
} from '../mapArbeidsforholdToApiData';

const historiskPeriode: DateRange = {
    from: apiStringDateToDate('2021-02-01'),
    to: apiStringDateToDate('2021-02-05'),
};

const planlagtPeriode: DateRange = {
    from: apiStringDateToDate('2021-02-06'),
    to: apiStringDateToDate('2021-02-10'),
};

const arbeidHistoriskPeriode: ArbeidIPeriode = {
    jobberIPerioden: JobberIPeriodeSvar.JA,
    jobberSomVanlig: YesOrNo.NO,
    erLiktHverUke: YesOrNo.NO,
    enkeltdager: {
        '2021-02-01': { hours: '2' },
    },
};

const arbeidEnkeltdagerHistoriskPeriode = { '2021-02-02': { hours: '2' } };

const arbeidPlanlagtPeriode: ArbeidIPeriode = {
    jobberIPerioden: JobberIPeriodeSvar.JA,
    jobberSomVanlig: YesOrNo.NO,
    erLiktHverUke: YesOrNo.NO,
    enkeltdager: {
        '2021-02-07': { hours: '2' },
    },
};

describe('mapArbeidsforholdToApiData', () => {
    describe('getHistoriskArbeidIArbeidsforhold', () => {
        it('returnerer undefined  dersom en kun søker planlagt periode', () => {
            const result = getHistoriskArbeidIArbeidsforhold({
                søkerFortid: false,
                søkerFremtid: true,
                arbeidHistoriskPeriode,
                historiskPeriode,
            });
            expect(result).toBeUndefined();
        });
        it('returnerer informasjon dersom en kun søker historisk periode', () => {
            const result = getHistoriskArbeidIArbeidsforhold({
                søkerFortid: true,
                søkerFremtid: false,
                arbeidHistoriskPeriode,
                historiskPeriode,
            });
            expect(result).toBeDefined();
        });
        it('returnerer informasjon dersom en søker både historisk og planlagt periode', () => {
            const result = getHistoriskArbeidIArbeidsforhold({
                søkerFortid: true,
                søkerFremtid: true,
                arbeidHistoriskPeriode,
                historiskPeriode,
            });
            expect(result).toBeDefined();
        });
    });
    describe('getPlanlagtArbeidIArbeidsforhold', () => {
        it('returnerer undefined dersom søker kun historisk', () => {
            const result = getPlanlagtArbeidIArbeidsforhold({
                søkerFortid: true,
                søkerFremtid: false,
                arbeidPlanlagtPeriode,
                planlagtPeriode,
            });
            expect(result).toBeUndefined();
        });
        it('returnerer defined planlagt arbeid dersom en kun søker planlagt', () => {
            const result = getPlanlagtArbeidIArbeidsforhold({
                søkerFortid: false,
                søkerFremtid: true,
                arbeidPlanlagtPeriode,
                planlagtPeriode,
            });
            expect(result).toBeDefined();
        });
        it('returnerer defined planlagt arbeid dersom en søker historisk og planlagt', () => {
            const result = getPlanlagtArbeidIArbeidsforhold({
                søkerFortid: true,
                søkerFremtid: true,
                arbeidPlanlagtPeriode,
                planlagtPeriode,
            });
            expect(result).toBeDefined();
        });
    });
    describe('mapArbeidIPeriodeToApiData', () => {
        it('jobber ikke i perioden', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.NEI,
                    jobberSomVanlig: YesOrNo.YES,
                    enkeltdager: arbeidEnkeltdagerHistoriskPeriode,
                    fasteDager: { fredag: { hours: '2', minutes: '0' } },
                },
                historiskPeriode
            );
            expect(result.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
            expect(result.jobberSomVanlig).toBeUndefined();
            expect(result.fasteDager).toBeUndefined();
            expect(result.erLiktHverUke).toBeUndefined();
            expect(result.enkeltdager).toBeUndefined();
        });
        it('vet ikke om en skal jobbe i perioden', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.VET_IKKE,
                    jobberSomVanlig: YesOrNo.YES,
                    enkeltdager: arbeidEnkeltdagerHistoriskPeriode,
                    fasteDager: { fredag: { hours: '2', minutes: '0' } },
                },
                historiskPeriode
            );
            expect(result.jobberIPerioden).toEqual(JobberIPeriodeSvar.VET_IKKE);
            expect(result.jobberSomVanlig).toBeUndefined();
            expect(result.fasteDager).toBeUndefined();
            expect(result.erLiktHverUke).toBeUndefined();
            expect(result.enkeltdager).toBeUndefined();
        });

        it('jobber som vanlig i perioden', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    jobberSomVanlig: YesOrNo.YES,
                    enkeltdager: arbeidEnkeltdagerHistoriskPeriode,
                    fasteDager: { fredag: { hours: '2', minutes: '0' } },
                },
                historiskPeriode
            );
            expect(result.jobberIPerioden).toEqual(JobberIPeriodeSvar.JA);
            expect(result.jobberSomVanlig).toBeTruthy();
            expect(result.fasteDager).toBeUndefined();
            expect(result.erLiktHverUke).toBeUndefined();
            expect(result.enkeltdager).toBeUndefined();
        });

        it('jobber likt hver uke', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    jobberSomVanlig: YesOrNo.NO,
                    erLiktHverUke: YesOrNo.YES,
                    enkeltdager: arbeidEnkeltdagerHistoriskPeriode,
                    fasteDager: { fredag: { hours: '2', minutes: '0' } },
                },
                historiskPeriode
            );
            expect(result.erLiktHverUke).toEqual(true);
            expect(result.fasteDager).toBeDefined();
        });

        it('jobber ulikt hver uke', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    jobberSomVanlig: YesOrNo.NO,
                    erLiktHverUke: YesOrNo.YES,
                    enkeltdager: arbeidEnkeltdagerHistoriskPeriode,
                    fasteDager: { fredag: { hours: '2', minutes: '0' } },
                },
                historiskPeriode
            );
            expect(result.erLiktHverUke).toEqual(true);
            expect(result.fasteDager).toBeDefined();
            expect(result.enkeltdager).toBeUndefined();
        });

        it('jobber ulikt hver uke', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    jobberSomVanlig: YesOrNo.NO,
                    erLiktHverUke: YesOrNo.NO,
                    enkeltdager: arbeidEnkeltdagerHistoriskPeriode,
                    fasteDager: { fredag: { hours: '2', minutes: '0' } },
                },
                historiskPeriode
            );
            expect(result.erLiktHverUke).toEqual(false);
            expect(result.fasteDager).toBeUndefined();
            expect(result.enkeltdager).toBeDefined();
        });
        it('har ikke svart på om det er likt eller ulikt - bruker enkeltdager', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    jobberSomVanlig: YesOrNo.NO,
                    erLiktHverUke: undefined,
                    enkeltdager: arbeidEnkeltdagerHistoriskPeriode,
                    fasteDager: { fredag: { hours: '2', minutes: '0' } },
                },
                historiskPeriode
            );
            expect(result.erLiktHverUke).toBeUndefined();
            expect(result.fasteDager).toBeUndefined();
            expect(result.enkeltdager).toBeDefined();
        });
    });
});
