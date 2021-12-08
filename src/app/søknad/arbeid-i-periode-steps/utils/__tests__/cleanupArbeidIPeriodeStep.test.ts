/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import { getPeriodeSomFrilanserInnenforPeriode } from '../../../../utils/frilanserUtils';

dayjs.extend(minMax);

describe('arbeidIPeriodeStepUtils', () => {
    const periodeFromDateString = '2021-02-01';
    const periodeToDateString = '2021-02-12';

    const periode: DateRange = {
        from: datepickerUtils.getDateFromDateString(periodeFromDateString)!,
        to: datepickerUtils.getDateFromDateString(periodeToDateString)!,
    };
    describe('getPeriodeSomFrilanserInneforPeriode', () => {
        it('returnerer opprinnelig periode når frilans startdato er før periode og er fortsatt frilanser', () => {
            const result = getPeriodeSomFrilanserInnenforPeriode(periode, {
                frilans_startdato: '2021-01-01',
                frilans_sluttdato: undefined,
                frilans_jobberFortsattSomFrilans: YesOrNo.YES,
            });
            expect(dayjs(result?.from).isSame(periode.from, 'day')).toBeTruthy();
        });
        // it('returnerer opprinnelig periode når frilans-sluttdato er etter periode', () => {
        //     const result = getPeriodeSomFrilanserInneforPeriode(periode, {
        //         frilans_startdato: '2021-01-01',
        //         frilans_sluttdato: '2021-03-01',
        //         frilans_jobberFortsattSomFrilans: YesOrNo.NO,
        //     });
        //     expect(dayjs(result?.to).isSame(periode.to, 'day')).toBeTruthy();
        // });
        // it('bruker frilans-startdato som periode.from når frilans-startdato er i periode og er fortsatt frilanser', () => {
        //     const result = getPeriodeSomFrilanserInneforPeriode(periode, {
        //         frilans_startdato: '2021-02-05',
        //         frilans_sluttdato: undefined,
        //         frilans_jobberFortsattSomFrilans: YesOrNo.YES,
        //     });
        //     expect(datepickerUtils.getDateStringFromValue(result?.from)).toEqual('2021-02-05');
        // });
        // it('bruker frilans-sluttdato som periode.to når frilans-sluttdato er i periode', () => {
        //     const result = getPeriodeSomFrilanserInneforPeriode(periode, {
        //         frilans_startdato: '2021-01-01',
        //         frilans_sluttdato: '2021-02-06',
        //         frilans_jobberFortsattSomFrilans: YesOrNo.NO,
        //     });
        //     expect(datepickerUtils.getDateStringFromValue(result?.to)).toEqual('2021-02-06');
        // });
        // it('returnerer undefined dersom frilans-startdato og frilans-sluttdato er utenfor periode', () => {
        //     const result = getPeriodeSomFrilanserInneforPeriode(periode, {
        //         frilans_startdato: '2021-03-01',
        //         frilans_sluttdato: '2021-03-05',
        //         frilans_jobberFortsattSomFrilans: YesOrNo.NO,
        //     });
        //     expect(result).toBeUndefined();
        // });
    });
});
