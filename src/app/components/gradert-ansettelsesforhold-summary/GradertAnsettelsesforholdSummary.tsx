import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import bemUtils from 'app/utils/bemUtils';
import { AnsettelsesforholdApi } from 'app/types/PleiepengesøknadApiData';
import intlHelper from '../../utils/intlUtils';

import './gradertAnsettelsforholdSummary.less';
import { calcRedusertProsentFromRedusertTimer } from '../../utils/ansettelsesforholdUtils';
import TextareaSummary from '../textarea-summary/TextareaSummary';

interface AnsettelsesforholdSummaryProps {
    ansettelsesforhold: AnsettelsesforholdApi;
}

const bem = bemUtils('gradertAnsettelsesforholdSummary');

const GradertAnsettelsesforholdSummary: React.FunctionComponent<AnsettelsesforholdSummaryProps & InjectedIntlProps> = ({
    ansettelsesforhold,
    intl
}) => {
    const {
        navn,
        organisasjonsnummer,
        skal_jobbe_prosent,
        skal_jobbe_timer,
        jobber_normalt_timer,
        skal_jobbe
    } = ansettelsesforhold;
    const orgInfo = { navn, organisasjonsnummer };
    return (
        <div className={bem.block}>
            <div className={bem.element('org')}>
                <FormattedMessage id="gradertAnsettelsesforhold.oppsummering.orgInfo" values={orgInfo} />
            </div>
            {skal_jobbe === 'redusert' && (
                <div className={bem.element('detaljer')}>
                    {skal_jobbe_timer !== undefined ? (
                        <Normaltekst>
                            <FormattedMessage
                                id={`gradertAnsettelsesforhold.oppsummering.svar.redusert.timer`}
                                values={{
                                    timerRedusert: intlHelper(intl, 'timer', { timer: skal_jobbe_timer }),
                                    timerNormalt: intlHelper(intl, 'timer', { timer: jobber_normalt_timer }),
                                    prosentRedusert: calcRedusertProsentFromRedusertTimer(
                                        jobber_normalt_timer!,
                                        skal_jobbe_timer
                                    ).toFixed(2)
                                }}
                            />
                        </Normaltekst>
                    ) : (
                        <Normaltekst>
                            <FormattedMessage
                                id={`gradertAnsettelsesforhold.oppsummering.svar.redusert.prosent`}
                                values={{
                                    timerNormalt: intlHelper(intl, 'timer', { timer: jobber_normalt_timer }),
                                    prosentRedusert: skal_jobbe_prosent
                                }}
                            />
                        </Normaltekst>
                    )}
                </div>
            )}
            {skal_jobbe === 'vet_ikke' && (
                <div className={bem.element('detaljer')}>
                    <Normaltekst>
                        <FormattedMessage id={`gradertAnsettelsesforhold.oppsummering.svar.vet_ikke`} />
                    </Normaltekst>
                    <TextareaSummary text={ansettelsesforhold.vet_ikke_ekstrainfo} />
                </div>
            )}
            {skal_jobbe !== 'vet_ikke' && skal_jobbe !== 'redusert' && (
                <div className={bem.element('detaljer')}>
                    <Normaltekst>
                        <FormattedMessage id={`gradertAnsettelsesforhold.oppsummering.svar.${skal_jobbe}`} />
                    </Normaltekst>
                </div>
            )}
        </div>
    );
};

export default injectIntl(GradertAnsettelsesforholdSummary);
