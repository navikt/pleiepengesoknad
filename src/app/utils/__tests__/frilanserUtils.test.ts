/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { erFrilanserISøknadsperiode, getPeriodeSomFrilanserInneforPeriode } from '../frilanserUtils';
import minMax from 'dayjs/plugin/minMax';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(minMax);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

type TestData = Partial<PleiepengesøknadFormData>;

const formValues: TestData = {
    frilans_harHattInntektSomFrilanser: YesOrNo.YES,
};

describe('Frilanser sluttdato er innenfor søknadsperiode', () => {
    const values: TestData = {
        ...formValues,
        periodeFra: '2021-01-31',
    };
    it('should return false if frilans end date is before application period ', () => {
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2021-01-19' })).toBeFalsy();
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2021-01-30' })).toBeFalsy();
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2020-01-19' })).toBeFalsy();
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2020-01-31' })).toBeFalsy();
    });

    it('should return true if frilans end date is in or after application period ', () => {
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2021-01-31' })).toBeTruthy();
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2021-02-01' })).toBeTruthy();
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2021-02-19' })).toBeTruthy();
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: '2022-01-31' })).toBeTruthy();
    });

    it('should return false if frilans sluttdato is undefined', () => {
        expect(erFrilanserISøknadsperiode({ ...values, frilans_sluttdato: undefined })).toBeFalsy();
    });

    it('should return false if periodeFra is undefined', () => {
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: undefined, frilans_sluttdato: '2021-01-31' })
        ).toBeFalsy();
    });

    it('should return false if periodeFra and frilans end date is undefined', () => {
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: undefined, frilans_sluttdato: undefined })
        ).toBeFalsy();
    });

    it('should return false if periodeFra and (or) frilans end date has bad format', () => {
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: '45gdg89', frilans_sluttdato: '2021-01-31' })
        ).toBeFalsy();
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: '2021-32-01', frilans_sluttdato: '2021-01-31' })
        ).toBeFalsy();
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: '2021-01-32', frilans_sluttdato: '2021-01-31' })
        ).toBeFalsy();
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: '2021-01-31', frilans_sluttdato: '2021-01-32' })
        ).toBeFalsy();
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: '2021-01-31', frilans_sluttdato: '2021-dr-44' })
        ).toBeFalsy();
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: '2021-01-32', frilans_sluttdato: '2021-01-31' })
        ).toBeFalsy();
    });

    it('should return false if periodeFra has bad format', () => {
        expect(
            erFrilanserISøknadsperiode({ ...values, periodeFra: 'undefined23', frilans_sluttdato: '344undefined' })
        ).toBeFalsy();
    });
});

describe('arbeidIPeriodeStepUtils', () => {
    const periodeFromDateString = '2021-02-01';
    const periodeToDateString = '2021-02-12';

    const periode: DateRange = {
        from: datepickerUtils.getDateFromDateString(periodeFromDateString)!,
        to: datepickerUtils.getDateFromDateString(periodeToDateString)!,
    };
    describe('getPeriodeSomFrilanserInneforPeriode', () => {
        it('returnerer opprinnelig periode når frilans startdato er før periode og er fortsatt frilanser', () => {
            const result = getPeriodeSomFrilanserInneforPeriode(periode, {
                frilans_startdato: '2021-01-01',
                frilans_sluttdato: undefined,
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            });
            expect(dayjs(result?.from).isSame(periode.from, 'day')).toBeTruthy();
        });
        it('returnerer opprinnelig periode når frilans-sluttdato er etter periode', () => {
            const result = getPeriodeSomFrilanserInneforPeriode(periode, {
                frilans_startdato: '2021-01-01',
                frilans_sluttdato: '2021-03-01',
                frilans_jobberFortsattSomFrilans: YesOrNo.NO,
            });
            expect(dayjs(result?.to).isSame(periode.to, 'day')).toBeTruthy();
        });
        it('bruker frilans-startdato som periode.from når frilans-startdato er i periode og er fortsatt frilanser', () => {
            const result = getPeriodeSomFrilanserInneforPeriode(periode, {
                frilans_startdato: '2021-02-05',
                frilans_sluttdato: undefined,
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            });
            expect(datepickerUtils.getDateStringFromValue(result?.from)).toEqual('2021-02-05');
        });
        it('bruker frilans-sluttdato som periode.to når frilans-sluttdato er i periode', () => {
            const result = getPeriodeSomFrilanserInneforPeriode(periode, {
                frilans_startdato: '2021-01-01',
                frilans_sluttdato: '2021-02-06',
                frilans_jobberFortsattSomFrilans: YesOrNo.NO,
            });
            expect(datepickerUtils.getDateStringFromValue(result?.to)).toEqual('2021-02-06');
        });
        it('returnerer undefined dersom frilans-startdato og frilans-sluttdato er utenfor periode', () => {
            const result = getPeriodeSomFrilanserInneforPeriode(periode, {
                frilans_startdato: '2021-03-01',
                frilans_sluttdato: '2021-03-05',
                frilans_jobberFortsattSomFrilans: YesOrNo.NO,
            });
            expect(result).toBeUndefined();
        });
    });
});
