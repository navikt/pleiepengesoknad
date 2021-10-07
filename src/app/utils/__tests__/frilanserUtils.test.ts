/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { erFrilanserIPeriode, erFrilanserITidsrom } from '../frilanserUtils';

dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type TestData = Partial<PleiepengesøknadFormData>;

const formValues: TestData = {
    frilans_harHattInntektSomFrilanser: YesOrNo.YES,
};

describe('erFrilanserITidsrom', () => {
    const tidsrom: DateRange = {
        from: apiStringDateToDate('2021-02-01'),
        to: apiStringDateToDate('2021-02-05'),
    };

    const frilansStartdato: Date = apiStringDateToDate('2021-01-01');

    it('returnerer false dersom sluttdato er før periode', () => {
        expect(
            erFrilanserITidsrom(tidsrom, { frilansStartdato, frilansSluttdato: apiStringDateToDate('2021-01-01') })
        ).toBeFalsy();
    });
    it('returnerer true dersom sluttdato er lik første dag i perioden', () => {
        expect(
            erFrilanserITidsrom(tidsrom, {
                frilansStartdato: apiStringDateToDate('2021-01-01'),
                frilansSluttdato: apiStringDateToDate('2021-02-01'),
            })
        ).toBeTruthy();
    });
    it('returnerer false dersom startdato er etter periode', () => {
        expect(erFrilanserITidsrom(tidsrom, { frilansStartdato: apiStringDateToDate('2021-02-06') })).toBeFalsy();
    });
    it('returnerer true dersom startdato er lik første dag i perioden', () => {
        expect(erFrilanserITidsrom(tidsrom, { frilansStartdato: apiStringDateToDate('2021-02-01') })).toBeTruthy();
    });
});

describe('Frilanser sluttdato er innenfor søknadsperiode', () => {
    const values: TestData = {
        ...formValues,
        frilans_startdato: '2020-01-01',
    };
    const periode: DateRange = {
        from: apiStringDateToDate('2021-01-31'),
        to: apiStringDateToDate('2021-05-31'),
    };
    it('should return false if frilans end date is before application period ', () => {
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2021-01-19' })).toBeFalsy();
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2021-01-30' })).toBeFalsy();
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2020-01-19' })).toBeFalsy();
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2020-01-31' })).toBeFalsy();
    });

    it('should return true if frilans end date is in or after application period ', () => {
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2021-01-31' })).toBeTruthy();
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2021-02-01' })).toBeTruthy();
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2021-02-19' })).toBeTruthy();
        expect(erFrilanserIPeriode(periode, { ...values, frilans_sluttdato: '2022-01-31' })).toBeTruthy();
    });
});
