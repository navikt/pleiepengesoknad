import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { SøknadFormData } from '../../../types/SøknadFormData';

export const visVernepliktSpørsmål = ({
    ansatt_arbeidsforhold = [],
    frilans_harHattInntektSomFrilanser,
    selvstendig_harHattInntektSomSN,
}: Partial<SøknadFormData>): boolean => {
    return (
        frilans_harHattInntektSomFrilanser === YesOrNo.NO &&
        selvstendig_harHattInntektSomSN === YesOrNo.NO &&
        ansatt_arbeidsforhold.some((a) => a.erAnsatt === YesOrNo.YES) === false &&
        ansatt_arbeidsforhold.some((a) => a.erAnsatt === YesOrNo.NO && a.sluttetFørSøknadsperiode !== YesOrNo.YES) ===
            false
    );
};
