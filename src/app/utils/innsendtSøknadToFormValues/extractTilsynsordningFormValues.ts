import { SøknadFormField, SøknadFormValues } from '../../types/SøknadFormValues';
import { InnsendtSøknadInnhold } from '../../types/InnsendtSøknad';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { booleanToYesOrNo } from '../booleanToYesOrNo';

type TilsynsordningFormValues = Pick<SøknadFormValues, SøknadFormField.omsorgstilbud>;

export const extractTilsynsordningFormValues = ({
    omsorgstilbud,
}: InnsendtSøknadInnhold): TilsynsordningFormValues | undefined => {
    if (!omsorgstilbud) {
        return undefined;
    }
    const formValues: TilsynsordningFormValues = {
        omsorgstilbud: {
            erIOmsorgstilbud: YesOrNo.YES,
            erLiktHverUke: booleanToYesOrNo(omsorgstilbud.erLiktHverUke),
            enkeltdager: {},
            fasteDager: {},
        },
    };
    return formValues;
};
