import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { ArbeidsforholdAnsatt, ArbeidsforholdSluttetNårSvar } from '../types/PleiepengesøknadFormData';

export const erAnsattIPeriode = (periode: DateRange, arbeidsgivere: ArbeidsforholdAnsatt[]): boolean => {
    return arbeidsgivere.some(
        (a) =>
            a.erAnsatt === YesOrNo.YES ||
            (a.erAnsatt === YesOrNo.NO && a.sluttetNår === ArbeidsforholdSluttetNårSvar.iSøknadsperiode)
    );
};
