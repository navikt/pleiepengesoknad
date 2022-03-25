import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getDurationsInDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidISøknadsperiodeSøknadsdata, NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { getPercentageOfDurationWeekdays } from '../arbeidstid-step/shared/utils/arbeidstimerUtils';

export const extractArbeidISøknadsperiodeSøknadsdata = (
    {
        jobberIPerioden,
        enkeltdager,
        erLiktHverUke,
        fasteDager,
        jobberProsent,
        timerEllerProsent,
    }: ArbeidIPeriodeFormData,
    normalarbeidstid: NormalarbeidstidSøknadsdata,
    søknadsperiode: DateRange
): ArbeidISøknadsperiodeSøknadsdata | undefined => {
    const skalArbeide: boolean = jobberIPerioden === YesOrNo.YES;
    if (skalArbeide === false) {
        return {
            type: 'arbeiderIkkeIPerioden',
            skalArbeide: false,
        };
    }
    const arbeidstidErLikHverUke = erLiktHverUke === YesOrNo.YES;
    if (arbeidstidErLikHverUke) {
        const arbeiderProsent =
            timerEllerProsent === TimerEllerProsent.PROSENT ? getNumberFromNumberInputValue(jobberProsent) : undefined;

        if (fasteDager === undefined && arbeiderProsent !== undefined) {
            return {
                type: 'fastProsent',
                skalArbeide,
                erLiktHverUke: true,
                jobberProsent: arbeiderProsent,
                fasteDager: getPercentageOfDurationWeekdays(arbeiderProsent, normalarbeidstid.fasteDager),
            };
        }
        if (fasteDager !== undefined && arbeiderProsent === undefined) {
            return {
                type: 'fastDager',
                skalArbeide,
                erLiktHverUke: arbeidstidErLikHverUke,
                fasteDager,
            };
        }
        return undefined;
    } else {
        if (!enkeltdager) {
            return undefined;
        }
        return {
            type: 'variert',
            skalArbeide,
            erLiktHverUke: false,
            enkeltdager: getDurationsInDateRange(enkeltdager, søknadsperiode),
        };
    }
};
