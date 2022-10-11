import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { OmsorgstilbudSvarApi } from '../../types/søknad-api-data/SøknadApiData';
import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { booleanToYesOrNo } from '../booleanToYesOrNo';
import {
    mapTidEnkeltdagApiDataToDateDurationMap,
    mapTimerFasteDagerToDurationWeekdays,
} from './extractFormValuesUtils';

type OmsorgstilbudFormValues = Pick<SøknadFormValues, SøknadFormField.omsorgstilbud>;

const omsorgstilbudSvarApiToYesOrNo = (svar?: OmsorgstilbudSvarApi): YesOrNo | undefined => {
    switch (svar) {
        case OmsorgstilbudSvarApi.JA:
            return YesOrNo.YES;
        case OmsorgstilbudSvarApi.NEI:
            return YesOrNo.NO;
        case OmsorgstilbudSvarApi.USIKKER:
            return YesOrNo.DO_NOT_KNOW;
        default:
            return undefined;
    }
};

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
            erIOmsorgstilbudFortid: omsorgstilbudSvarApiToYesOrNo(omsorgstilbud.svarFortid),
            erIOmsorgstilbudFremtid: omsorgstilbudSvarApiToYesOrNo(omsorgstilbud.svarFremtid),
            erLiktHverUke:
                omsorgstilbud.erLiktHverUke !== undefined ? booleanToYesOrNo(omsorgstilbud.erLiktHverUke) : undefined,
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
