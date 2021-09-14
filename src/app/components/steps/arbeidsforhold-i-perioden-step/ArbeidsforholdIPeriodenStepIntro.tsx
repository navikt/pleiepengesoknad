import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';

interface Props {
    skalBesvareAnsettelsesforhold: boolean;
    skalBesvareFrilans?: boolean;
    skalBesvareSelvstendig?: boolean;
    antallAnsettelsesforhold: number;
}

const ArbeidsforholdIPeriodenStepIntro: React.FunctionComponent<Props> = ({
    skalBesvareAnsettelsesforhold,
    skalBesvareFrilans,
    skalBesvareSelvstendig,
    antallAnsettelsesforhold,
}) => {
    const intl = useIntl();
    const arbeidsinfo: string[] = [];
    if (skalBesvareAnsettelsesforhold) {
        arbeidsinfo.push('ansatt');
    }
    if (skalBesvareFrilans) {
        arbeidsinfo.push('frilans');
    }
    if (skalBesvareSelvstendig) {
        arbeidsinfo.push('selvstendig');
    }

    return (
        <FormattedMessage
            id="step.arbeidsforholdIPerioden.StepInfo.1"
            values={{
                info: intlHelper(intl, `step.arbeidsforholdIPerioden.StepInfo.1.info.${arbeidsinfo.join('_')}`, {
                    antall: antallAnsettelsesforhold,
                }),
            }}
        />
    );
};

export default ArbeidsforholdIPeriodenStepIntro;
