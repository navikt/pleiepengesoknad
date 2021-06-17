import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange, ISOStringToDate } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { VetOmsorgstilbud } from '../../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { visKunEnkeltdagerForOmsorgstilbud } from '../../../utils/omsorgstilbudUtils';
import { skalBrukerSvarePåBeredskapOgNattevåk } from '../../../utils/stepUtils';
import { OmsorgstilbudDag, TidIOmsorgstilbud } from '../../omsorgstilbud/types';

dayjs.extend(isBetween);

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
    const cleanedValues = { ...values };

    if (cleanedValues.omsorgstilbud?.skalBarnIOmsorgstilbud === YesOrNo.YES && cleanedValues.omsorgstilbud.ja) {
        if (cleanedValues.omsorgstilbud.ja.vetHvorMyeTid === VetOmsorgstilbud.VET_IKKE) {
            cleanedValues.omsorgstilbud.ja.enkeltdager = undefined;
            cleanedValues.omsorgstilbud.ja.fasteDager = undefined;
            cleanedValues.omsorgstilbud.ja.erLiktHverDag = undefined;
        }
        if (visKunEnkeltdagerForOmsorgstilbud(søknadsperiode)) {
            cleanedValues.omsorgstilbud.ja.erLiktHverDag = undefined;
        }
        if (cleanedValues.omsorgstilbud.ja.erLiktHverDag === YesOrNo.YES) {
            cleanedValues.omsorgstilbud.ja.enkeltdager = undefined;
        }
        if (cleanedValues.omsorgstilbud.ja.erLiktHverDag === YesOrNo.NO) {
            cleanedValues.omsorgstilbud.ja.fasteDager = undefined;
            cleanedValues.omsorgstilbud.ja.enkeltdager = getTidIOmsorgstilbudInnenforPeriode(
                cleanedValues.omsorgstilbud.ja.enkeltdager || {},
                søknadsperiode
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
        cleanedValues.omsorgstilbud.ja = undefined;
    }

    return cleanedValues;
};
