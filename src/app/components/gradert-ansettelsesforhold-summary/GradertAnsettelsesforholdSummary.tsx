import React from 'react';
import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
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
    const { navn, organisasjonsnummer, redusert_arbeidsprosent } = ansettelsesforhold;
    const orgInfo = { navn, organisasjonsnummer };
    return (
        <div className={bem.block}>
            <div className={bem.element('org')}>
                <FormattedMessage id="gradertAnsettelsesforhold.oppsummering.orgInfo" values={orgInfo} />
            </div>
            {redusert_arbeidsprosent !== undefined && (
                <div className={bem.element('detaljer')}>
                    {<Normaltekst>Skal arbeide {redusert_arbeidsprosent} prosent av normalt</Normaltekst>}
                </div>
            )}
        </div>
    );
};

export default injectIntl(GradertAnsettelsesforholdSummary);
