import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { booleanToYesOrNo } from '../booleanToYesOrNo';
import {
    mapTidEnkeltdagApiDataToDateDurationMap,
    mapTimerFasteDagerToDurationWeekdays,
} from './extractFormValuesUtils';

type OmsorgstilbudFormValues = Pick<SøknadFormValues, SøknadFormField.omsorgstilbud>;

export const extractOmsorgstilbudFormValues = ({
    omsorgstilbud,
}: InnsendtSøknadInnhold): OmsorgstilbudFormValues | undefined => {
    if (!omsorgstilbud) {
        return undefined;
    }
    if (omsorgstilbud.erLiktHverUke && omsorgstilbud.ukedager === undefined) {
        throw new Error('extractOmsorgstilbudFormValues: erLiktHverUke===true, ukedager===undefined');
    }
    if (omsorgstilbud.erLiktHverUke === false && omsorgstilbud.enkeltdager === undefined) {
        throw new Error('extractOmsorgstilbudFormValues: erLiktHverUke===false, enkeltdager===undefined');
    }
    const formValues: OmsorgstilbudFormValues = {
        omsorgstilbud: {
            erIOmsorgstilbud: YesOrNo.YES,
            erLiktHverUke: booleanToYesOrNo(omsorgstilbud.erLiktHverUke),
            enkeltdager:
                omsorgstilbud.erLiktHverUke === false && omsorgstilbud.enkeltdager
                    ? mapTidEnkeltdagApiDataToDateDurationMap(omsorgstilbud.enkeltdager)
                    : undefined,
            fasteDager:
                omsorgstilbud.erLiktHverUke === true && omsorgstilbud.ukedager
                    ? mapTimerFasteDagerToDurationWeekdays(omsorgstilbud.ukedager)
                    : undefined,
        },
    };
    return formValues;
};
