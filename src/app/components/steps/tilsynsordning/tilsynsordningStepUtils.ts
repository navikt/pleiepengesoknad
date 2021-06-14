import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, ISOStringToDate } from '@navikt/sif-common-formik/lib';
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
    søknadsperiode: DateRange
): PleiepengesøknadFormData => {
    const v = { ...values };

    if (v.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.YES) {
        if (v.omsorgstilbud.ja?.erLiktHverDag === YesOrNo.YES) {
            v.omsorgstilbud.ja.enkeltdager = undefined;
        }
        if (v.omsorgstilbud.ja?.erLiktHverDag === YesOrNo.NO) {
            v.omsorgstilbud.ja.fasteDager = undefined;
        }
        if (v.omsorgstilbud.ja) {
            v.omsorgstilbud.ja.enkeltdager = getTidIOmsorgstilbudInnenforPeriode(
                v.omsorgstilbud.ja?.enkeltdager || {},
                søknadsperiode
            );
        }
    }
    if (v.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.NO) {
        v.omsorgstilbud.ja = undefined;
    }

    return v;
};
