/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateRange, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { TidEnkeltdag } from '../../types';
import { getHistoriskPeriode, getPlanlagtPeriode, getTidEnkeltdagerInnenforPeriode } from '../tidsbrukUtils';

dayjs.extend(isSameOrAfter);

const søknadsperiode: DateRange = {
    from: new Date(2020, 2, 1),
    to: new Date(2020, 4, 1),
};

const søknadsdatoFørSøknadsperiode = new Date(2020, 1, 1);
const søknadsdatoISøknadsperiode = new Date(2020, 3, 1);
const søknadsdatoEtterSøknadsperiode = new Date(2020, 5, 1);

describe('getTidEnkeltdagerInnenforPeriode', () => {
    const enkeldagerFormData: TidEnkeltdag = {
        '2021-03-01': { hours: '2', minutes: '30' }, // Outside range
        '2021-03-02': { hours: '2', minutes: '30' }, // Historic
        '2021-03-03': { hours: '2', minutes: '30' }, // Planned
        '2021-03-04': { hours: '2', minutes: '30' }, // Planned
        '2021-03-05': { hours: '2', minutes: '30' }, // Outside range
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

describe('getHistoriskPeriode', () => {
    it('returnerer undefined dersom søknadsdato er før søknadsperiode', () => {
        const result = getHistoriskPeriode(søknadsperiode, søknadsdatoFørSøknadsperiode);
        expect(result).toBeUndefined();
    });
    it('returnerer historisk periode dersom søknadsdato er etter startdato i søknadsperioden', () => {
        const result = getHistoriskPeriode(søknadsperiode, søknadsdatoISøknadsperiode);
        expect(result).toBeDefined();
    });
    it('returnerer historisk periode som går fra søknadsperiode.from til dagen før søknadsdato når søknadsperiode slutter etter søknadsdato', () => {
        const result = getHistoriskPeriode(søknadsperiode, søknadsdatoISøknadsperiode);
        const datoFørSøknadsdato = dayjs(søknadsdatoISøknadsperiode).subtract(1, 'day');
        expect(result).toBeDefined();
        if (result) {
            expect(dayjs(result.from).isSame(søknadsperiode.from, 'day')).toBeTruthy();
            expect(dayjs(result.to).isSame(datoFørSøknadsdato, 'day')).toBeTruthy();
        }
    });
    it('returnerer historisk periode som er lik søknadsperiode når søknadsperiode slutter før søknadsdato', () => {
        const result = getHistoriskPeriode(søknadsperiode, søknadsdatoEtterSøknadsperiode);
        expect(result).toBeDefined();
        if (result) {
            expect(dayjs(result.from).isSame(søknadsperiode.from, 'day')).toBeTruthy();
            expect(dayjs(result.to).isSame(søknadsperiode.to, 'day')).toBeTruthy();
        }
    });
});
describe('getPlanlagtPeriode', () => {
    it('returnerer undefined dersom søknadsdato er etter søknadsperiode', () => {
        const result = getPlanlagtPeriode(søknadsperiode, søknadsdatoEtterSøknadsperiode);
        expect(result).toBeUndefined();
    });
    it('returnerer planlagt periode dersom søknadsdato starter på søknadsperiode.from', () => {
        const result = getPlanlagtPeriode(søknadsperiode, søknadsperiode.from);
        expect(result).toBeDefined();
    });
    it('Planlagt periode stemmer overens med angitt søknadsperiode når søknadsdato er lik startdato i søknadsperiode', () => {
        const result = getPlanlagtPeriode(søknadsperiode, søknadsperiode.from);
        expect(result).toBeDefined();
        if (result) {
            expect(dayjs(result.from).isSame(søknadsperiode.from, 'day'));
            expect(dayjs(result.to).isSame(søknadsperiode.to, 'day'));
        }
    });
    it('Planlagt periode starter på angitt startdato dersom startdato er etter søknadsdato', () => {
        const dato = new Date(2020, 1, 1);
        const periode: DateRange = {
            from: new Date(2020, 2, 1),
            to: new Date(2020, 3, 1),
        };

        const result = getPlanlagtPeriode(periode, dato);
        expect(result).toBeDefined();
        if (result) {
            expect(dayjs(result.from).isSame(periode.from, 'day'));
            expect(dayjs(result.to).isSame(periode.to, 'day'));
            expect(dayjs(result.from).isAfter(dato, 'day')).toBeTruthy();
        }
    });
});
