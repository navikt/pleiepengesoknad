import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import { getMonthsInDateRange } from '../../omsorgstilbud/omsorgstilbudUtils';
import { OmsorgstilbudDag, TidIOmsorgstilbud } from '../../omsorgstilbud/types';
import dayjs from 'dayjs';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';

export const mapTidIOmsorgToOmsorgstilbudDag = (tidIOmsorgstilbud: TidIOmsorgstilbud): OmsorgstilbudDag[] => {
    const dager: OmsorgstilbudDag[] = [];
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

export const getTidIOmsorgstilbudInnenforPeriode = (
    dager: TidIOmsorgstilbud,
    periode: DateRange
): TidIOmsorgstilbud => {
    const dagerIPerioden: TidIOmsorgstilbud = {};
    Object.keys(dager).forEach((dag) => {
        const dato = ISOStringToDate(dag);
        if (dato && dayjs(dato).isBetween(periode.from, periode.to, 'day', '[]')) {
            dagerIPerioden[dag] = dager[dag];
        }
    });
    return dagerIPerioden;
};

export const cleanupTilsynsordningStep = (
    values: PleiepengesøknadFormData,
    spørOmMånedForOmsorgstilbud: boolean,
    søknadsperiode: DateRange
): PleiepengesøknadFormData => {
    const v = { ...values };

    if (v.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (v.omsorgstilbud.ja?.vetHvorMyeTid === YesOrNo.YES) {
            v.omsorgstilbud.ja.vetNoeTid = YesOrNo.UNANSWERED;
        }
        if (v.omsorgstilbud.ja?.vetHvorMyeTid === YesOrNo.NO) {
            if (v.omsorgstilbud.ja?.vetNoeTid === YesOrNo.NO) {
                v.omsorgstilbud.ja.erLiktHverDag = YesOrNo.UNANSWERED;
                v.omsorgstilbud.ja.fasteDager = undefined;
                v.omsorgstilbud.ja.måneder = undefined;
            }
        }
        if (v.omsorgstilbud.ja?.erLiktHverDag === YesOrNo.YES) {
            v.omsorgstilbud.ja.måneder = undefined;
            v.omsorgstilbud.ja.enkeltdager = undefined;
        }
        if (v.omsorgstilbud.ja?.erLiktHverDag === YesOrNo.NO) {
            v.omsorgstilbud.ja.fasteDager = undefined;
        }

        const { måneder } = v.omsorgstilbud.ja || {};
        const enkeltdager = getTidIOmsorgstilbudInnenforPeriode(v.omsorgstilbud.ja?.enkeltdager || {}, søknadsperiode);
        if (enkeltdager && spørOmMånedForOmsorgstilbud && måneder) {
            /** Fjern enkeltdager hvor bruker har sagt nei, men allikevel har fylt ut omsorgstilbud */
            getMonthsInDateRange(søknadsperiode).forEach((month, index) => {
                const { skalHaOmsorgstilbud } = måneder[index] || {};
                if (!skalHaOmsorgstilbud || skalHaOmsorgstilbud === YesOrNo.NO) {
                    Object.keys(enkeltdager).forEach((dag) => {
                        const dato = ISOStringToDate(dag);
                        if (dayjs(dato).isSame(month.from, 'month')) {
                            delete enkeltdager[dag];
                        }
                    });
                }
            });
        }
        if (v.omsorgstilbud.ja) {
            v.omsorgstilbud.ja.enkeltdager = enkeltdager;
        }
    }
    if (v.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.NO) {
        v.omsorgstilbud.ja = undefined;
    }

    return v;
};
