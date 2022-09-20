import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { dateToISODate } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver } from '../../types';
import { FrilansFormData } from '../../types/FrilansFormData';
import { ArbeidFrilansSøknadsdata } from '../../types/søknadsdata/arbeidFrilansSøknadsdata';
import { getArbeidSøknadsperiodeFormValues } from './getArbeidSøknadsperiodeFormValues';
import { getNormalarbeidstidFormValues } from './getNormalarbeidstidFormValues';

const getYesOrNoAnswerFromBoolean = (flag?: boolean, useUnanswered?: boolean): YesOrNo | undefined => {
    switch (flag) {
        case true:
            return YesOrNo.YES;
        case false:
            return YesOrNo.NO;
        default:
            return useUnanswered === true ? YesOrNo.UNANSWERED : undefined;
    }
};

const getErFrilansvarSvarFraSøknadsdata = (
    søknadsdata: ArbeidFrilansSøknadsdata,
    registrerteFrilansoppdrag: Arbeidsgiver[] = []
): YesOrNo | undefined => {
    return registrerteFrilansoppdrag.length > 0 ? undefined : getYesOrNoAnswerFromBoolean(søknadsdata.erFrilanser);
};

export const getArbeidFrilansFormValues = (
    søknadsdata: ArbeidFrilansSøknadsdata,
    registrerteFrilansoppdrag: Arbeidsgiver[] = []
): FrilansFormData => {
    const erFrilanserIPerioden = getErFrilansvarSvarFraSøknadsdata(søknadsdata, registrerteFrilansoppdrag);

    if (søknadsdata.type === 'erIkkeFrilanser') {
        return {
            erFrilanserIPerioden,
        };
    }

    if (søknadsdata.type === 'avsluttetFørSøknadsperiode') {
        return {
            erFrilanserIPerioden,
            erFortsattFrilanser: YesOrNo.NO,
            startdato: dateToISODate(søknadsdata.startdato),
            sluttdato: dateToISODate(søknadsdata.sluttdato),
        };
    }

    if (søknadsdata.type === 'kunFosterhjemsgodtgjørelse') {
        return {
            erFrilanserIPerioden,
            fosterhjemsgodtgjørelse_mottar: YesOrNo.YES,
            fosterhjemsgodtgjørelse_harFlereOppdrag: YesOrNo.NO,
        };
    }

    return {
        erFrilanserIPerioden,
        erFortsattFrilanser: getYesOrNoAnswerFromBoolean(søknadsdata.type !== 'avsluttetISøknadsperiode'),
        startdato: dateToISODate(søknadsdata.startdato),
        sluttdato: søknadsdata.type === 'avsluttetISøknadsperiode' ? dateToISODate(søknadsdata.sluttdato) : undefined,
        fosterhjemsgodtgjørelse_mottar: getYesOrNoAnswerFromBoolean(søknadsdata.mottarFosterhjemsgodtgjørelse),
        fosterhjemsgodtgjørelse_harFlereOppdrag: getYesOrNoAnswerFromBoolean(
            søknadsdata.harAndreOppdragEnnFosterhjemsgodtgjørelse
        ),
        arbeidsforhold: {
            sluttetFørSøknadsperiode: søknadsdata.erFortsattFrilanser ? YesOrNo.NO : YesOrNo.YES,
            arbeidIPeriode: getArbeidSøknadsperiodeFormValues(søknadsdata.arbeidsforhold.arbeidISøknadsperiode),
            normalarbeidstid: getNormalarbeidstidFormValues(søknadsdata.arbeidsforhold.normalarbeidstid),
        },
    };
};
