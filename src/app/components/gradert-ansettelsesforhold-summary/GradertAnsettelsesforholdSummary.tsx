import React from 'react';
import { AnsettelsesforholdForm } from 'app/types/PleiepengesøknadFormData';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { getIntlAnsettelsesforholdsdetaljerForSummary } from 'app/utils/ansettelsesforholdUtils';
import bemUtils from 'app/utils/bemUtils';

import './gradertAnsettelsforholdSummary.less';

interface AnsettelsesforholdSummaryProps {
    ansettelsesforhold: AnsettelsesforholdForm;
}

const bem = bemUtils('gradertAnsettelsesforholdSummary');

const GradertAnsettelsesforholdSummary: React.FunctionComponent<AnsettelsesforholdSummaryProps> = ({
    ansettelsesforhold
}) => {
    const { navn, organisasjonsnummer } = ansettelsesforhold;
    const orgInfo = { navn, organisasjonsnummer };
    const intlInfo = getIntlAnsettelsesforholdsdetaljerForSummary(ansettelsesforhold);
    return (
        <div className={bem.block}>
            <div className={bem.element('org')}>
                <FormattedMessage id="gradertArbeidsforhold.oppsummering.orgInfo" values={orgInfo} />
            </div>
            {intlInfo !== undefined && (
                <div className={bem.element('detaljer')}>
                    {
                        <Normaltekst>
                            <FormattedMessage {...intlInfo} />
                        </Normaltekst>
                    }
                </div>
            )}
        </div>
    );
};

export default GradertAnsettelsesforholdSummary;
