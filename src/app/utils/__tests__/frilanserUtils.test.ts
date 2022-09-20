import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { ISODateRangeToDateRange, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver, ArbeidsgiverType } from '../../types';
import { erFrilanserISøknadsperiode, erFrilanserITidsrom } from '../frilanserUtils';

const søknadsperiode = ISODateRangeToDateRange('2021-01-05/2021-01-10');
const startdato = '2021-01-06';
const frilansoppdragIPeriode: Arbeidsgiver = {
    id: '123',
    navn: 'Frilansoppdrag',
    type: ArbeidsgiverType.FRILANSOPPDRAG,
    ansattFom: ISODateToDate('2021-01-01'),
};

describe('frilanserUtils', () => {
    describe('erFrilanserISøknadsperiode', () => {
        it('returnerer true når bruker har svart at en er frilanser i perioden', () => {
            const result = erFrilanserISøknadsperiode(
                søknadsperiode,
                { erFrilanserIPerioden: YesOrNo.YES, startdato },
                []
            );
            expect(result).toBeTruthy();
        });
        it('returnerer true dersom bruker har registrert frilansoppdrag', () => {
            const result = erFrilanserISøknadsperiode(søknadsperiode, {}, [frilansoppdragIPeriode]);
            expect(result).toBeTruthy();
        });
        it('returnerer false fersom bruker har har svart nei på om en er frilanser', () => {
            const result = erFrilanserISøknadsperiode(søknadsperiode, { erFrilanserIPerioden: YesOrNo.NO }, []);
            expect(result).toBeFalsy();
        });
    });
    describe('erFrilanserITidsrom', () => {
        it('returnerer true dersom startdato er inne i tidsrom', () => {
            expect(erFrilanserITidsrom(søknadsperiode, ISODateToDate('2021-01-05'))).toBeTruthy();
            expect(erFrilanserITidsrom(søknadsperiode, ISODateToDate('2021-01-07'))).toBeTruthy();
            expect(erFrilanserITidsrom(søknadsperiode, ISODateToDate('2021-01-10'))).toBeTruthy();
        });
        it('returnerer true dersom startdato er før tidsrom og sluttdato er inne i, eller etter, tidsrom', () => {
            const frilansStartdato: Date = ISODateToDate('2021-01-01');
            expect(erFrilanserITidsrom(søknadsperiode, frilansStartdato, ISODateToDate('2021-01-05'))).toBeTruthy();
            expect(erFrilanserITidsrom(søknadsperiode, frilansStartdato, ISODateToDate('2021-01-07'))).toBeTruthy();
            expect(erFrilanserITidsrom(søknadsperiode, frilansStartdato, ISODateToDate('2021-01-10'))).toBeTruthy();
            expect(erFrilanserITidsrom(søknadsperiode, frilansStartdato, ISODateToDate('2021-01-11'))).toBeTruthy();
        });
        it('returnerer false dersom startdato er før tidsrom og sluttdato er før tidsrom', () => {
            const frilansStartdato: Date = ISODateToDate('2021-01-01');
            expect(erFrilanserITidsrom(søknadsperiode, frilansStartdato, ISODateToDate('2021-01-04'))).toBeFalsy();
        });
        it('returnerer false dersom startdato er etter tidsrom', () => {
            const frilansStartdato: Date = ISODateToDate('2021-01-11');
            expect(erFrilanserITidsrom(søknadsperiode, frilansStartdato)).toBeFalsy();
        });
    });
});
