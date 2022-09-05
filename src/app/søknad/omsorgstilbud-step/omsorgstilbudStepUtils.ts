import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { SøknadFormData } from '../../types/SøknadFormData';
import { getDurationsInDateRange } from '@navikt/sif-common-utils';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../../utils/stepUtils';
import { OmsorgstilbudSvar } from '../../types/søknad-api-data/SøknadApiData';

dayjs.extend(isBetween);

export const MIN_ANTALL_DAGER_FOR_FAST_PLAN_I_OMSORGSTILBUD = 6;

export const skalViseSpørsmålOmProsentEllerLiktHverUke = (periode: DateRange): boolean => {
    const antallDager = dayjs(periode.to).diff(periode.from, 'days');
    if (antallDager < MIN_ANTALL_DAGER_FOR_FAST_PLAN_I_OMSORGSTILBUD) {
        return false;
    }
    return true;
};

export const cleanupOmsorgstilbudStep = (values: SøknadFormData, søknadsperiode: DateRange): SøknadFormData => {
    const cleanedValues = { ...values };
    const inkluderLiktHverUke = skalViseSpørsmålOmProsentEllerLiktHverUke(søknadsperiode);
    if (cleanedValues.omsorgstilbud) {
        if (
            cleanedValues.omsorgstilbud?.erIOmsorgstilbud === OmsorgstilbudSvar.IKKE_OMSORGSTILBUD ||
            cleanedValues.omsorgstilbud?.erIOmsorgstilbud === OmsorgstilbudSvar.IKKE_FAST_OG_REGELMESSIG
        ) {
            cleanedValues.omsorgstilbud.enkeltdager = undefined;
            cleanedValues.omsorgstilbud.fasteDager = undefined;
            cleanedValues.omsorgstilbud.erLiktHverUke = undefined;
        } else if (
            cleanedValues.omsorgstilbud?.erIOmsorgstilbud === OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG &&
            cleanedValues.omsorgstilbud?.fastIOmsorgstilbud === YesOrNo.NO
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
                    søknadsperiode
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
