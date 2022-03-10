import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateDurationMap } from '@navikt/sif-common-utils';
import { JobberIPeriodeSvar } from '../../../types';
import { ArbeidIPeriodeApiData } from '../../../types/SøknadApiData';
import { mapArbeidIPeriodeToApiData } from '../mapArbeidsforholdToApiData';

const søknadsperiode: DateRange = {
    from: apiStringDateToDate('2021-02-01'),
    to: apiStringDateToDate('2021-02-10'),
};

const arbeidEnkeltdager: DateDurationMap = {
    '2021-02-01': { hours: '2', minutes: '0' },
    '2021-02-02': { hours: '2', minutes: '0' },
    '2021-02-03': { hours: '2', minutes: '0' },
    '2021-02-04': { hours: '2', minutes: '0' },
    '2021-02-05': { hours: '2', minutes: '0' },
};

describe('mapArbeidsforholdToApiData', () => {
    it('jobber ikke i perioden', () => {
        const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
            {
                jobberIPerioden: JobberIPeriodeSvar.NEI,
                enkeltdager: arbeidEnkeltdager,
                fasteDager: { friday: { hours: '2', minutes: '0' } },
            },
            søknadsperiode,
            40,
            undefined
        );
        expect(result.jobberIPerioden).toEqual(JobberIPeriodeSvar.NEI);
        expect(result.fasteDager).toBeUndefined();
        expect(result.erLiktHverUke).toBeUndefined();
        expect(result.enkeltdager).toBeUndefined();
    });

    it('jobber likt hver uke', () => {
        const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
            {
                jobberIPerioden: JobberIPeriodeSvar.JA,
                erLiktHverUke: YesOrNo.YES,
                enkeltdager: arbeidEnkeltdager,
                fasteDager: { friday: { hours: '2', minutes: '0' } },
            },
            søknadsperiode,
            40,
            undefined
        );
        expect(result.erLiktHverUke).toEqual(true);
        expect(result.fasteDager).toBeDefined();
    });

    it('jobber ulikt hver uke', () => {
        const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
            {
                jobberIPerioden: JobberIPeriodeSvar.JA,
                erLiktHverUke: YesOrNo.YES,
                enkeltdager: arbeidEnkeltdager,
                fasteDager: { friday: { hours: '2', minutes: '0' } },
            },
            søknadsperiode,
            40,
            undefined
        );
        expect(result.erLiktHverUke).toEqual(true);
        expect(result.fasteDager).toBeDefined();
        expect(result.enkeltdager).toBeUndefined();
    });

    it('jobber ulikt hver uke', () => {
        const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
            {
                jobberIPerioden: JobberIPeriodeSvar.JA,
                erLiktHverUke: YesOrNo.NO,
                enkeltdager: arbeidEnkeltdager,
                fasteDager: { friday: { hours: '2', minutes: '0' } },
            },
            søknadsperiode,
            40,
            undefined
        );
        expect(result.erLiktHverUke).toEqual(false);
        expect(result.fasteDager).toBeUndefined();
        expect(result.enkeltdager).toBeDefined();
    });
    it('har ikke svart på om det er likt eller ulikt - bruker enkeltdager', () => {
        const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
            {
                jobberIPerioden: JobberIPeriodeSvar.JA,
                erLiktHverUke: undefined,
                enkeltdager: arbeidEnkeltdager,
                fasteDager: { friday: { hours: '2', minutes: '0' } },
            },
            søknadsperiode,
            40,
            undefined
        );
        expect(result.erLiktHverUke).toBeUndefined();
        expect(result.fasteDager).toBeUndefined();
        expect(result.enkeltdager).toBeDefined();
    });
    describe('Avgrenset arbeidsperiode', () => {
        it('Starter å arbeide i perioden - fjerner dager oppgitt før startdato', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    enkeltdager: arbeidEnkeltdager,
                },
                søknadsperiode,
                40,
                {
                    from: apiStringDateToDate('2021-02-04'),
                }
            );
            const { enkeltdager } = result;
            expect(enkeltdager).toBeDefined();
            if (enkeltdager) {
                expect(enkeltdager.length).toBe(2);
                expect(enkeltdager[0].dato).toEqual('2021-02-04');
                expect(enkeltdager[1].dato).toEqual('2021-02-05');
            }
        });
        it('Slutter å arbeide i perioden - fjerner dager oppgitt etter sluttdato', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    enkeltdager: arbeidEnkeltdager,
                },
                søknadsperiode,
                40,
                {
                    to: apiStringDateToDate('2021-02-04'),
                }
            );
            const { enkeltdager } = result;
            expect(enkeltdager).toBeDefined();
            if (enkeltdager) {
                expect(enkeltdager.length).toBe(4);
                expect(enkeltdager[0].dato).toEqual('2021-02-01');
                expect(enkeltdager[1].dato).toEqual('2021-02-02');
                expect(enkeltdager[2].dato).toEqual('2021-02-03');
                expect(enkeltdager[3].dato).toEqual('2021-02-04');
            }
        });
        it('Starter og slutter å arbeide i perioden - fjerner dager utenfor start/sluttdato', () => {
            const result: ArbeidIPeriodeApiData = mapArbeidIPeriodeToApiData(
                {
                    jobberIPerioden: JobberIPeriodeSvar.JA,
                    enkeltdager: arbeidEnkeltdager,
                },
                søknadsperiode,
                40,
                {
                    from: apiStringDateToDate('2021-02-03'),
                    to: apiStringDateToDate('2021-02-04'),
                }
            );
            const { enkeltdager } = result;
            expect(enkeltdager).toBeDefined();
            if (enkeltdager) {
                expect(enkeltdager.length).toBe(2);
                expect(enkeltdager[0].dato).toEqual('2021-02-03');
                expect(enkeltdager[1].dato).toEqual('2021-02-04');
            }
        });
    });
});
