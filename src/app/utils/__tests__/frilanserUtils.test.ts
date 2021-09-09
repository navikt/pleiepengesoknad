import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { erFrilanserISøknadsperiode } from '../frilanserUtils';

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
