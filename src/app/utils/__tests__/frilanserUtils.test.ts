/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { apiStringDateToDate, DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { SøknadFormData } from '../../types/SøknadFormData';
import { erFrilanserIPeriode, erFrilanserITidsrom, getPeriodeSomFrilanserInnenforPeriode } from '../frilanserUtils';

dayjs.extend(minMax);

type TestData = Partial<SøknadFormData>;

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

describe('getPeriodeSomFrilanserInnenforPeriode', () => {
    const periodeFromDateString = '2021-02-01';
    const periodeToDateString = '2021-02-12';

    const periode: DateRange = {
        from: datepickerUtils.getDateFromDateString(periodeFromDateString)!,
        to: datepickerUtils.getDateFromDateString(periodeToDateString)!,
    };
    it('returnerer opprinnelig periode når frilans startdato er før periode og er fortsatt frilanser', () => {
        const result = getPeriodeSomFrilanserInnenforPeriode(periode, {
            frilans_startdato: '2021-01-01',
            frilans_sluttdato: undefined,
            frilans_jobberFortsattSomFrilans: YesOrNo.YES,
        });
        expect(dayjs(result?.from).isSame(periode.from, 'day')).toBeTruthy();
    });
    it('returnerer opprinnelig periode når frilans-sluttdato er etter periode', () => {
        const result = getPeriodeSomFrilanserInnenforPeriode(periode, {
            frilans_startdato: '2021-01-01',
            frilans_sluttdato: '2021-03-01',
            frilans_jobberFortsattSomFrilans: YesOrNo.NO,
        });
        expect(dayjs(result?.to).isSame(periode.to, 'day')).toBeTruthy();
    });
    it('bruker frilans-startdato som periode.from når frilans-startdato er i periode og er fortsatt frilanser', () => {
        const result = getPeriodeSomFrilanserInnenforPeriode(periode, {
            frilans_startdato: '2021-02-05',
            frilans_sluttdato: undefined,
            frilans_jobberFortsattSomFrilans: YesOrNo.YES,
        });
        expect(datepickerUtils.getDateStringFromValue(result?.from)).toEqual('2021-02-05');
    });
    it('bruker frilans-sluttdato som periode.to når frilans-sluttdato er i periode', () => {
        const result = getPeriodeSomFrilanserInnenforPeriode(periode, {
            frilans_startdato: '2021-01-01',
            frilans_sluttdato: '2021-02-06',
            frilans_jobberFortsattSomFrilans: YesOrNo.NO,
        });
        expect(datepickerUtils.getDateStringFromValue(result?.to)).toEqual('2021-02-06');
    });
    it('returnerer undefined dersom frilans-startdato og frilans-sluttdato er utenfor periode', () => {
        const result = getPeriodeSomFrilanserInnenforPeriode(periode, {
            frilans_startdato: '2021-03-01',
            frilans_sluttdato: '2021-03-05',
            frilans_jobberFortsattSomFrilans: YesOrNo.NO,
        });
        expect(result).toBeUndefined();
    });
});
