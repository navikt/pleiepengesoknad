import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { DagMedTid, TidsbrukDag } from '../../../types';
import { VetOmsorgstilbud } from '../../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import {
    getPlanlagtPeriode,
    getHistoriskPeriode,
    visKunEnkeltdagerForOmsorgstilbud,
} from '../../../utils/omsorgstilbudUtils';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../../../utils/stepUtils';

dayjs.extend(isBetween);

export const mapTidIOmsorgToDagMedTid = (tidIOmsorgstilbud: TidsbrukDag): DagMedTid[] => {
    const dager: DagMedTid[] = [];
    Object.keys(tidIOmsorgstilbud).forEach((key) => {
        const dato = ISOStringToDate(key);
        if (dato) {
            dager.push({
                dato,
                tid: tidIOmsorgstilbud[key],
            });
        }
    });
    return dager;
};

export const getTidIOmsorgstilbudInnenforPeriode = (dager: TidsbrukDag, periode: DateRange): TidsbrukDag => {
    const dagerIPerioden: TidsbrukDag = {};
    Object.keys(dager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && dayjs(dato).isBetween(periode.from, periode.to, 'day', '[]')) {
            dagerIPerioden[dag] = dager[dag];
        }
    });
    return dagerIPerioden;
};

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
            if (cleanedValues.omsorgstilbud.planlagt.vetHvorMyeTid === VetOmsorgstilbud.VET_IKKE) {
                cleanedValues.omsorgstilbud.planlagt.enkeltdager = undefined;
                cleanedValues.omsorgstilbud.planlagt.fasteDager = undefined;
                cleanedValues.omsorgstilbud.planlagt.erLiktHverUke = undefined;
            }
            if (visKunEnkeltdagerForOmsorgstilbud(søknadsperiode)) {
                cleanedValues.omsorgstilbud.planlagt.erLiktHverUke = undefined;
            }
            if (cleanedValues.omsorgstilbud.planlagt.erLiktHverUke === YesOrNo.YES) {
                cleanedValues.omsorgstilbud.planlagt.enkeltdager = undefined;
            }
            if (cleanedValues.omsorgstilbud.planlagt.erLiktHverUke === YesOrNo.NO) {
                cleanedValues.omsorgstilbud.planlagt.fasteDager = undefined;
                cleanedValues.omsorgstilbud.planlagt.enkeltdager = getTidIOmsorgstilbudInnenforPeriode(
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
            cleanedValues.omsorgstilbud.historisk.enkeltdager = getTidIOmsorgstilbudInnenforPeriode(
                cleanedValues.omsorgstilbud.historisk.enkeltdager || {},
                periodeFørSøknadsdato
            );
        }
        if (
            periodeFraOgMedSøknadsdato &&
            cleanedValues.omsorgstilbud.skalBarnIOmsorgstilbud === YesOrNo.YES &&
            cleanedValues.omsorgstilbud.planlagt
        ) {
            cleanedValues.omsorgstilbud.planlagt.enkeltdager = getTidIOmsorgstilbudInnenforPeriode(
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
