import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { harSvartErFrilanserEllerHarFrilansoppdrag } from '../../../utils/frilanserUtils';

export const harFraværFraArbeidISøknadsperiode = (values: SøknadFormData): boolean => {
    const erAnsattMedFravær = values.ansatt_arbeidsforhold.some((a) => a.harFraværIPeriode === YesOrNo.YES);

    const erFrilanserMedFravær =
        harSvartErFrilanserEllerHarFrilansoppdrag(values.frilans.harHattInntektSomFrilanser, values.frilansoppdrag) &&
        values.frilans.arbeidsforhold?.harFraværIPeriode === YesOrNo.YES;

    const erSelvstendigMedFravær =
        values.selvstendig_harHattInntektSomSN === YesOrNo.YES &&
        values.selvstendig_arbeidsforhold?.harFraværIPeriode === YesOrNo.YES;

    return erAnsattMedFravær || erFrilanserMedFravær || erSelvstendigMedFravær;
};
