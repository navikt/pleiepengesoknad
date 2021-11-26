import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../../../utils/stepUtils';
import {
    skalViseSpørsmålOmProsentEllerLiktHverUke,
    getHistoriskPeriode,
    getPlanlagtPeriode,
    getTidEnkeltdagerInnenforPeriode,
} from '../../../utils/tidsbrukUtils';

dayjs.extend(isBetween);

export const cleanupOmsorgstilbudStep = (
    values: PleiepengesøknadFormData,
    søknadsperiode: DateRange,
    søknadsdato: Date
): PleiepengesøknadFormData => {
    const cleanedValues = { ...values };

    if (cleanedValues.omsorgstilbud) {
        const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, søknadsdato);
        const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, søknadsdato);
        if (periodeFørSøknadsdato === undefined) {
            cleanedValues.omsorgstilbud.historisk = undefined;
            cleanedValues.omsorgstilbud.harBarnVærtIOmsorgstilbud = YesOrNo.UNANSWERED;
        }
        if (periodeFraOgMedSøknadsdato === undefined) {
            cleanedValues.omsorgstilbud.planlagt = undefined;
            cleanedValues.omsorgstilbud.skalBarnIOmsorgstilbud = YesOrNo.UNANSWERED;
        }
        if (
            cleanedValues.omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES &&
            cleanedValues.omsorgstilbud.planlagt
        ) {
            if (skalViseSpørsmålOmProsentEllerLiktHverUke(søknadsperiode) === false) {
                cleanedValues.omsorgstilbud.planlagt.erLiktHverUke = undefined;
            }
            if (cleanedValues.omsorgstilbud.planlagt.erLiktHverUke === YesOrNo.YES) {
                cleanedValues.omsorgstilbud.planlagt.enkeltdager = undefined;
            }
            if (cleanedValues.omsorgstilbud.planlagt.erLiktHverUke === YesOrNo.NO) {
                cleanedValues.omsorgstilbud.planlagt.fasteDager = undefined;
                cleanedValues.omsorgstilbud.planlagt.enkeltdager = getTidEnkeltdagerInnenforPeriode(
                    cleanedValues.omsorgstilbud.planlagt.enkeltdager || {},
                    søknadsperiode
                );
            }
        }
        if (cleanedValues.omsorgstilbud.harBarnVærtIOmsorgstilbud !== YesOrNo.YES) {
            cleanedValues.omsorgstilbud.historisk = undefined;
        }
        if (
            periodeFørSøknadsdato &&
            cleanedValues.omsorgstilbud.harBarnVærtIOmsorgstilbud === YesOrNo.YES &&
            cleanedValues.omsorgstilbud.historisk
        ) {
            cleanedValues.omsorgstilbud.historisk.enkeltdager = getTidEnkeltdagerInnenforPeriode(
                cleanedValues.omsorgstilbud.historisk.enkeltdager || {},
                periodeFørSøknadsdato
            );
        }
        if (
            periodeFraOgMedSøknadsdato &&
            cleanedValues.omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES &&
            cleanedValues.omsorgstilbud.planlagt
        ) {
            cleanedValues.omsorgstilbud.planlagt.enkeltdager = getTidEnkeltdagerInnenforPeriode(
                cleanedValues.omsorgstilbud.planlagt.enkeltdager || {},
                periodeFraOgMedSøknadsdato
            );
        }
    }
    if (skalBrukerSvarePåBeredskapOgNattevåk(values) === false) {
        cleanedValues.harNattevåk = YesOrNo.UNANSWERED;
        cleanedValues.harNattevåk_ekstrainfo = undefined;
        cleanedValues.harBeredskap = YesOrNo.UNANSWERED;
        cleanedValues.harBeredskap_ekstrainfo = undefined;
    }

    if (cleanedValues.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.NO) {
        cleanedValues.omsorgstilbud.planlagt = undefined;
    }

    return cleanedValues;
};
