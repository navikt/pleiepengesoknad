import { DateRange, getNumberFromNumberInputValue, YesOrNo } from '@navikt/sif-common-formik/lib';
import { getDurationsInDateRange } from '@navikt/sif-common-utils/lib';
import { TimerEllerProsent } from '../../types';
import { ArbeidIPeriodeFormData } from '../../types/ArbeidIPeriodeFormData';
import { ArbeidIPeriodeSøknadsdata, NormalarbeidstidSøknadsdata } from '../../types/Søknadsdata';
import { getPercentageOfDurationWeekdays } from '../arbeidstid-step/shared/utils/durationWeekdaysUtils';

export const extractArbeidIPeriodeSøknadsdata = (
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
): ArbeidIPeriodeSøknadsdata | undefined => {
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
                arbeiderIPerioden: skalArbeide,
                erLiktHverUke: true,
                jobberProsent: arbeiderProsent,
                fasteDager: getPercentageOfDurationWeekdays(arbeiderProsent, normalarbeidstid.fasteDager),
            };
        }
        if (fasteDager !== undefined && arbeiderProsent === undefined) {
            return {
                type: 'fasteDager',
                arbeiderIPerioden: skalArbeide,
                erLiktHverUke: arbeidstidErLikHverUke,
                fasteDager,
            };
        }
        return undefined;
    } else {
        if (enkeltdager) {
            return {
                type: 'variert',
                arbeiderIPerioden: skalArbeide,
                erLiktHverUke: false,
                enkeltdager: getDurationsInDateRange(enkeltdager, søknadsperiode),
            };
        }
        return undefined;
    }
};
