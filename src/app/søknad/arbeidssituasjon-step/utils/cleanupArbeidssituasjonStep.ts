import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { Arbeidsgiver } from '../../../types';
import { ArbeidsforholdFormData, NormalarbeidstidFormData } from '../../../types/ArbeidsforholdFormData';
import { FrilansFormData } from '../../../types/FrilansFormData';
import { SøknadFormData } from '../../../types/SøknadFormData';
import { erFrilanserISøknadsperiode, harFrilansoppdrag } from '../../../utils/frilanserUtils';
import { visVernepliktSpørsmål } from './visVernepliktSpørsmål';

const cleanupNormalarbeidstid = ({
    erLiktHverUke,
    fasteDager,
    liktHverDag,

    timerPerUke,
}: NormalarbeidstidFormData): NormalarbeidstidFormData => {
    if (erLiktHverUke === YesOrNo.NO) {
        return {
            erLiktHverUke,
            timerPerUke,
        };
    }
    if (liktHverDag === YesOrNo.YES) {
        return {
            erLiktHverUke,
            liktHverDag,
        };
    }
    return {
        erLiktHverUke,
        liktHverDag,
        fasteDager,
    };
};

export const cleanupAnsattArbeidsforhold = (arbeidsforhold: ArbeidsforholdFormData): ArbeidsforholdFormData => {
    const cleanedArbeidsforhold = { ...arbeidsforhold };

    if (cleanedArbeidsforhold.erAnsatt === YesOrNo.YES) {
        cleanedArbeidsforhold.sluttetFørSøknadsperiode = undefined;
    }
    if (
        cleanedArbeidsforhold.erAnsatt === YesOrNo.NO &&
        cleanedArbeidsforhold.sluttetFørSøknadsperiode === YesOrNo.YES
    ) {
        cleanedArbeidsforhold.normalarbeidstid = undefined;
        cleanedArbeidsforhold.harFraværIPeriode = undefined;
    }
    if (
        cleanedArbeidsforhold.harFraværIPeriode === undefined ||
        cleanedArbeidsforhold.harFraværIPeriode === YesOrNo.NO
    ) {
        cleanedArbeidsforhold.arbeidIPeriode = undefined;
    }
    if (cleanedArbeidsforhold.normalarbeidstid) {
        cleanedArbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(cleanedArbeidsforhold.normalarbeidstid);
    }
    return cleanedArbeidsforhold;
};

export const cleanupFrilansArbeidssituasjon = (
    søknadsperiode: DateRange,
    values: FrilansFormData,
    frilansoppdrag: Arbeidsgiver[] | undefined
): FrilansFormData => {
    const frilans: FrilansFormData = { ...values };
    if (erFrilanserISøknadsperiode(søknadsperiode, values, frilansoppdrag) === false) {
        frilans.arbeidsforhold = undefined;
    }

    if (harFrilansoppdrag(frilansoppdrag)) {
        frilans.harHattInntektSomFrilanser = undefined;
        if (frilans.jobberFortsattSomFrilans === YesOrNo.YES) {
            frilans.sluttdato = undefined;
        }
    } else {
        if (frilans.harHattInntektSomFrilanser === YesOrNo.NO) {
            /** Er ikke frilanser i perioden */
            frilans.jobberFortsattSomFrilans = undefined;
            frilans.startdato = undefined;
            frilans.sluttdato = undefined;
            frilans.arbeidsforhold = undefined;
        }
        if (frilans.harHattInntektSomFrilanser === YesOrNo.YES) {
            /** Er frilanser i perioden */
            if (frilans.jobberFortsattSomFrilans === YesOrNo.YES) {
                frilans.sluttdato = undefined;
            }
        }
    }
    if (frilans.arbeidsforhold && frilans.arbeidsforhold.normalarbeidstid) {
        frilans.arbeidsforhold.normalarbeidstid = cleanupNormalarbeidstid(frilans.arbeidsforhold.normalarbeidstid);
    }

    return frilans;
};

export const cleanupArbeidssituasjonStep = (
    formValues: SøknadFormData,
    søknadsperiode: DateRange,
    frilansoppdrag: Arbeidsgiver[] | undefined
): SøknadFormData => {
    const values: SøknadFormData = { ...formValues };

    values.ansatt_arbeidsforhold = values.ansatt_arbeidsforhold.map(cleanupAnsattArbeidsforhold);

    values.frilans = cleanupFrilansArbeidssituasjon(søknadsperiode, values.frilans, frilansoppdrag);

    if (values.selvstendig.harHattInntektSomSN === YesOrNo.NO) {
        values.selvstendig.virksomhet = undefined;
        values.selvstendig.arbeidsforhold = undefined;
    }

    if (!visVernepliktSpørsmål(values)) {
        values.harVærtEllerErVernepliktig = undefined;
    }

    if (values.mottarAndreYtelser === YesOrNo.NO) {
        values.andreYtelser = [];
    }

    return values;
};
