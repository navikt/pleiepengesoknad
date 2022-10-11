import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { SøknadFormValues, OmsorgstilbudFormValues } from '../../types/SøknadFormValues';
import { getDurationsInDateRange } from '@navikt/sif-common-utils';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../../utils/stepUtils';

dayjs.extend(isBetween);

export const MIN_ANTALL_DAGER_FOR_FAST_PLAN_I_OMSORGSTILBUD = 6;

export const skalViseSpørsmålOmProsentEllerLiktHverUke = (periode: DateRange): boolean => {
    const antallDager = dayjs(periode.to).diff(periode.from, 'days');
    if (antallDager < MIN_ANTALL_DAGER_FOR_FAST_PLAN_I_OMSORGSTILBUD) {
        return false;
    }
    return true;
};

export const cleanupOmsorgstilbudStep = (values: SøknadFormValues, søknadsperiode: DateRange): SøknadFormValues => {
    const cleanedValues = { ...values };
    const inkluderLiktHverUke = skalViseSpørsmålOmProsentEllerLiktHverUke(søknadsperiode);

    if (cleanedValues.omsorgstilbud) {
        if (
            cleanedValues.omsorgstilbud?.erIOmsorgstilbudFortid !== YesOrNo.YES &&
            cleanedValues.omsorgstilbud?.erIOmsorgstilbudFremtid !== YesOrNo.YES
        ) {
            cleanedValues.omsorgstilbud.enkeltdager = undefined;
            cleanedValues.omsorgstilbud.fasteDager = undefined;
            cleanedValues.omsorgstilbud.erLiktHverUke = undefined;
        } else {
            if (inkluderLiktHverUke === false) {
                cleanedValues.omsorgstilbud.erLiktHverUke = undefined;
            }
            if (cleanedValues.omsorgstilbud.erLiktHverUke === YesOrNo.YES) {
                cleanedValues.omsorgstilbud.enkeltdager = undefined;
            }
            if (cleanedValues.omsorgstilbud.erLiktHverUke === YesOrNo.NO || inkluderLiktHverUke === false) {
                cleanedValues.omsorgstilbud.fasteDager = undefined;
                cleanedValues.omsorgstilbud.enkeltdager = getDurationsInDateRange(
                    cleanedValues.omsorgstilbud.enkeltdager || {},
                    getPeriode(søknadsperiode, cleanedValues.omsorgstilbud)
                );
            }
        }
    }
    if (skalBrukerSvarePåBeredskapOgNattevåk(values) === false) {
        cleanedValues.harNattevåk = YesOrNo.UNANSWERED;
        cleanedValues.harNattevåk_ekstrainfo = undefined;
        cleanedValues.harBeredskap = YesOrNo.UNANSWERED;
        cleanedValues.harBeredskap_ekstrainfo = undefined;
    }

    return cleanedValues;
};

export const søkerFremtid = (periode: DateRange): boolean => {
    if (dayjs(periode.from).isSame(dayjs(), 'day') || dayjs(periode.from).isAfter(dayjs(), 'day')) {
        return true;
    }
    return false;
};

export const søkerFortid = (periode: DateRange): boolean => {
    if (dayjs(periode.to).isBefore(dayjs(), 'day')) {
        return true;
    }
    return false;
};

export const søkerFortidFremtid = (periode: DateRange): boolean => {
    if (
        dayjs(periode.from).isBefore(dayjs(), 'day') &&
        (dayjs(periode.to).isAfter(dayjs(), 'day') || dayjs(periode.to).isSame(dayjs(), 'day'))
    ) {
        return true;
    }
    return false;
};

export const getPeriode = (søknadsperiode: DateRange, omsorgstilbud?: OmsorgstilbudFormValues): DateRange => {
    if (
        omsorgstilbud &&
        omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.YES &&
        (omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.NO ||
            omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW)
    ) {
        return {
            from: søknadsperiode.from,
            to: dayjs().subtract(1, 'day').toDate(),
        };
    }

    if (
        omsorgstilbud &&
        omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO &&
        omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.YES
    ) {
        return {
            from: dayjs().toDate(),
            to: søknadsperiode.to,
        };
    }

    return søknadsperiode;
};

export const visLiktHverUke = (
    periodeFortidFremtid: boolean,
    periodeFortid: boolean,
    periodeFremtid: boolean,
    omsorgstilbud?: OmsorgstilbudFormValues
): boolean => {
    if (!omsorgstilbud) {
        return false;
    }

    if (omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO && omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.NO) {
        return false;
    }
    if (
        omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO &&
        omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW
    ) {
        return false;
    }

    if (omsorgstilbud.erIOmsorgstilbudFremtid !== YesOrNo.YES && omsorgstilbud.erIOmsorgstilbudFortid === YesOrNo.NO)
        return false;
    if (omsorgstilbud.erIOmsorgstilbudFortid !== YesOrNo.YES && omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.NO)
        return false;
    if (
        omsorgstilbud.erIOmsorgstilbudFortid !== YesOrNo.YES &&
        omsorgstilbud.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW
    )
        return false;

    if (periodeFortidFremtid && (!omsorgstilbud.erIOmsorgstilbudFortid || !omsorgstilbud.erIOmsorgstilbudFremtid)) {
        return false;
    }

    if (periodeFortid && !omsorgstilbud.erIOmsorgstilbudFortid) {
        return false;
    }

    if (periodeFremtid && !omsorgstilbud.erIOmsorgstilbudFremtid) {
        return false;
    }

    return true;
};

export const getSpmTeksterLiktHverUke = (omsorgstilbud?: OmsorgstilbudFormValues): string => {
    if (
        omsorgstilbud?.erIOmsorgstilbudFortid === YesOrNo.YES &&
        (omsorgstilbud?.erIOmsorgstilbudFremtid === YesOrNo.NO || omsorgstilbud?.erIOmsorgstilbudFremtid === undefined)
    )
        return 'fortid';

    if (
        omsorgstilbud?.erIOmsorgstilbudFortid === YesOrNo.YES &&
        omsorgstilbud?.erIOmsorgstilbudFremtid === YesOrNo.DO_NOT_KNOW
    )
        return 'fortidFremtidUsiker';

    if (omsorgstilbud?.erIOmsorgstilbudFortid === YesOrNo.NO && omsorgstilbud?.erIOmsorgstilbudFremtid === YesOrNo.YES)
        return 'fremtid';

    if (omsorgstilbud?.erIOmsorgstilbudFortid === undefined && omsorgstilbud?.erIOmsorgstilbudFremtid === YesOrNo.YES)
        return 'kunFremtid';

    return 'fortidFremtid';
};
