/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateRange, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { DatoTidMap } from '../../types';
import { getTidEnkeltdagerInnenforPeriode } from '../datoTidUtils';

dayjs.extend(isSameOrAfter);

describe('getTidEnkeltdagerInnenforPeriode', () => {
    const enkeldagerFormData: DatoTidMap = {
        '2021-03-01': { tid: { hours: '2', minutes: '30' } }, // Outside range
        '2021-03-02': { tid: { hours: '2', minutes: '30' } }, // Historic
        '2021-03-03': { tid: { hours: '2', minutes: '30' } }, // Planned
        '2021-03-04': { tid: { hours: '2', minutes: '30' } }, // Planned
        '2021-03-05': { tid: { hours: '2', minutes: '30' } }, // Outside range
    };
    const periode: DateRange = {
        from: ISOStringToDate('2021-03-02')!,
        to: ISOStringToDate('2021-03-04')!,
    };
    it('extract days within periode', () => {
        const result = getTidEnkeltdagerInnenforPeriode(enkeldagerFormData, periode);
        expect(Object.keys(result).length).toBe(3);
        expect(result['2021-03-01']).toBeUndefined();
        expect(result['2021-03-02']).toBeDefined(); // historic
        expect(result['2021-03-03']).toBeDefined(); // Søknadsdato
        expect(result['2021-03-04']).toBeDefined(); // planned
        expect(result['2021-03-05']).toBeUndefined();
    });
});
