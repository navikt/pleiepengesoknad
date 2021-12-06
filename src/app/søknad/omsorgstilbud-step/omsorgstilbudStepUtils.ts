import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { SøknadFormData } from '../../types/SøknadFormData';
import { getTidEnkeltdagerInnenforPeriode } from '../../utils/datoTidUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../utils/fortidFremtidUtils';
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

export const cleanupOmsorgstilbudStep = (
    values: SøknadFormData,
    søknadsperiode: DateRange,
    søknadsdato: Date
): SøknadFormData => {
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
