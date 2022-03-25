import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { ISODateRangeToDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../../types';
import { NormalarbeidstidSøknadsdata } from '../../../types/Søknadsdata';
import { extractArbeidISøknadsperiodeSøknadsdata } from '../extractArbeidISøknadsperiodeSøknadsdata';

const søknadsperiode = ISODateRangeToDateRange('2022-01-01/2022-02-01');
const normalarbeidstid: NormalarbeidstidSøknadsdata = {
    erLiktHverUke: true,
    fasteDager: { monday: { hours: '5', minutes: '0' }, tuesday: { hours: '5', minutes: '0' } },
    timerPerUke: 10,
};

describe('extractArbeidISøknadsperiodeSøknadsdata', () => {
    it('runs', () => {
        const result = extractArbeidISøknadsperiodeSøknadsdata(
            {
                jobberIPerioden: YesOrNo.YES,
                jobberProsent: '50',
                timerEllerProsent: TimerEllerProsent.PROSENT,
            },
            normalarbeidstid,
            søknadsperiode
        );
        expect(result).toBeDefined();
    });
});
