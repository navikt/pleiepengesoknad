import React from 'react';
import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import { getIntlAnsettelsesforholdsdetaljerForSummary } from 'app/utils/ansettelsesforholdUtils';
import bemUtils from 'app/utils/bemUtils';

import './gradertAnsettelsforholdSummary.less';

interface AnsettelsesforholdSummaryProps {
    ansettelsesforhold: AnsettelsesforholdForm;
}

const bem = bemUtils('gradertAnsettelsesforholdSummary');

const GradertAnsettelsesforholdSummary: React.FunctionComponent<AnsettelsesforholdSummaryProps & InjectedIntlProps> = ({
    ansettelsesforhold,
    intl
}) => {
    const { navn, organisasjonsnummer } = ansettelsesforhold;
    const orgInfo = { navn, organisasjonsnummer };
    const detaljer = getIntlAnsettelsesforholdsdetaljerForSummary(ansettelsesforhold, intl);
    return (
        <div className={bem.block}>
            <div className={bem.element('org')}>
                <FormattedMessage id="gradertAnsettelsesforhold.oppsummering.orgInfo" values={orgInfo} />
            </div>
            {detaljer !== undefined && (
                <div className={bem.element('detaljer')}>{<Normaltekst>{detaljer}</Normaltekst>}</div>
            )}
        </div>
    );
};

export default injectIntl(GradertAnsettelsesforholdSummary);
