import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { TidEnkeltdagApiData } from '../../../types/PleiepengesøknadApiData';
import { fjernTidUtenforPeriode, getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from '../tidsbrukApiUtils';

describe('tidsbrukApiUtils', () => {
    describe('getFasteDagerApiData', () => {
        it('alle dager er defined dersom de er satt', () => {
            const result = getFasteDagerApiData({
                mandag: { hours: '1', minutes: '10' },
                tirsdag: { hours: '1', minutes: '10' },
                onsdag: { hours: '1', minutes: '10' },
                torsdag: { hours: '1', minutes: '10' },
                fredag: { hours: '1', minutes: '10' },
            });
            expect(result.mandag).toBeDefined();
            expect(result.tirsdag).toBeDefined();
            expect(result.onsdag).toBeDefined();
            expect(result.torsdag).toBeDefined();
            expect(result.fredag).toBeDefined();
        });
        it('alle dager er undefined dersom de ikke er satt', () => {
            const result = getFasteDagerApiData({
                mandag: undefined,
                tirsdag: undefined,
                onsdag: undefined,
                torsdag: undefined,
                fredag: undefined,
            });
            expect(result.mandag).toBeUndefined();
            expect(result.tirsdag).toBeUndefined();
            expect(result.onsdag).toBeUndefined();
            expect(result.torsdag).toBeUndefined();
            expect(result.fredag).toBeUndefined();
        });
    });
    describe('getEnkeltdagerIPeriodeApiData', () => {
        const periode: DateRange = {
            from: apiStringDateToDate('2021-02-02'),
            to: apiStringDateToDate('2021-02-05'),
        };
        it('returnerer tom liste dersom ingen dager satt', () => {
            const result = getEnkeltdagerIPeriodeApiData({}, periode);
            expect(result.length).toEqual(0);
        });
        it('returnerer kun dager, sortert, som er innenfor tidsrom', () => {
            const result = getEnkeltdagerIPeriodeApiData(
                {
                    '2021-02-01': { hours: '1', minutes: '0' },
                    '2021-02-05': { hours: '1', minutes: '0' },
                    '2021-02-03': { hours: '1', minutes: '0' },
                    '2021-02-02': { hours: '1', minutes: '0' },
                    '2021-02-04': { hours: '1', minutes: '0' },
                    '2021-02-06': { hours: '1', minutes: '0' },
                },
                periode
            );
            expect(result.length).toEqual(4);
            expect(result[0].dato).toEqual('2021-02-02');
            expect(result[1].dato).toEqual('2021-02-03');
            expect(result[2].dato).toEqual('2021-02-04');
            expect(result[3].dato).toEqual('2021-02-05');
        });
    });

    describe('fjernTidUtenforPeriode', () => {
        it('fjerner tid som er før eller etter periode', () => {
            const periode: Partial<DateRange> = {
                from: apiStringDateToDate('2021-02-05'),
                to: apiStringDateToDate('2021-02-06'),
            };
            const tidEnkeltdager: TidEnkeltdagApiData[] = [
                { dato: '2021-02-04', tid: '2' },
                { dato: '2021-02-05', tid: '2' },
                { dato: '2021-02-06', tid: '2' },
                { dato: '2021-02-07', tid: '2' },
            ];
            const result = fjernTidUtenforPeriode(periode, tidEnkeltdager);
            expect(result).toBeDefined();
            if (result) {
                expect(result.length).toBe(2);
                expect(result[0].dato).toEqual('2021-02-05');
                expect(result[1].dato).toEqual('2021-02-06');
            }
        });
    });
});
