import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { HistoriskOmsorgstilbudApiData, PlanlagtOmsorgstilbudApiData, SøknadApiData } from '../../types/SøknadApiData';
import { Omsorgstilbud } from '../../types/SøknadFormData';
import appSentryLogger from '../appSentryLogger';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../fortidFremtidUtils';
import { getEnkeltdagerIPeriodeApiData, getFasteDagerApiData } from './tidsbrukApiUtils';

type OmsorgstilbudApiDataPart = Pick<SøknadApiData, 'omsorgstilbud'>;

export const mapPlanlagtOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange,
    søknadsdato: Date
): PlanlagtOmsorgstilbudApiData | undefined => {
    const { planlagt, skalBarnIOmsorgstilbud } = omsorgstilbud;

    if (skalBarnIOmsorgstilbud !== YesOrNo.YES || !planlagt) {
        return undefined;
    }

    const { erLiktHverUke, fasteDager, enkeltdager } = planlagt;

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            erLiktHverUke: true,
            ukedager: getFasteDagerApiData(fasteDager),
        };
    }
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager && periodeFraOgMedSøknadsdato) {
        return {
            erLiktHverUke: false,
            enkeltdager: getEnkeltdagerIPeriodeApiData(enkeltdager, periodeFraOgMedSøknadsdato),
        };
    }
    return undefined;
};

export const mapHistoriskOmsorgstilbudToApiData = (
    omsorgstilbud: Omsorgstilbud,
    søknadsperiode: DateRange,
    søknadsdato: Date
): HistoriskOmsorgstilbudApiData | undefined => {
    const { harBarnVærtIOmsorgstilbud, historisk } = omsorgstilbud;

    if (harBarnVærtIOmsorgstilbud !== YesOrNo.YES || !historisk) {
        return undefined;
    }
    const { erLiktHverUke, fasteDager, enkeltdager } = historisk;

    if (erLiktHverUke === YesOrNo.YES && fasteDager) {
        return {
            erLiktHverUke: true,
            ukedager: getFasteDagerApiData(fasteDager),
        };
    }

    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, søknadsdato);
    if (erLiktHverUke !== YesOrNo.YES && enkeltdager && periodeFørSøknadsdato) {
        return {
            erLiktHverUke: false,
            enkeltdager: getEnkeltdagerIPeriodeApiData(enkeltdager, periodeFørSøknadsdato),
        };
    }
    return undefined;
};

export const getOmsorgstilbudApiData = (
    omsorgstilbud: Omsorgstilbud | undefined,
    søknadsperiode: DateRange,
    søknadsdato: Date
): OmsorgstilbudApiDataPart => {
    if (!omsorgstilbud) {
        return {
            omsorgstilbud: undefined,
        };
    }
    const { harBarnVærtIOmsorgstilbud, skalBarnIOmsorgstilbud } = omsorgstilbud;

    const historisk =
        harBarnVærtIOmsorgstilbud === YesOrNo.YES
            ? mapHistoriskOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode, søknadsdato)
            : undefined;
    const planlagt =
        skalBarnIOmsorgstilbud === YesOrNo.YES
            ? mapHistoriskOmsorgstilbudToApiData(omsorgstilbud, søknadsperiode, søknadsdato)
            : undefined;

    /** Feilsøke situasjon hvor en tidligere sendte inn undefined for både historisk og planlagt */
    if (
        (harBarnVærtIOmsorgstilbud === YesOrNo.YES && historisk === undefined) ||
        (skalBarnIOmsorgstilbud === YesOrNo.YES && planlagt === undefined)
    ) {
        const payload = {
            harBarnVærtIOmsorgstilbud,
            skalBarnIOmsorgstilbud,
            søknadsperiode,
            søknadsdato,
            historiskErDefinert: omsorgstilbud.historisk !== undefined,
            planlagtErDefinert: omsorgstilbud.planlagt !== undefined,
        };
        appSentryLogger.logError('Ugyldig omsorgstilbud informasjon', JSON.stringify(payload));
    }

    if (historisk || planlagt) {
        return {
            omsorgstilbud: {
                historisk,
                planlagt,
            },
        };
    }

    return {
        omsorgstilbud: undefined,
    };
};
