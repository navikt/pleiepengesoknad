import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from 'common/utils/intlUtils';
import { ArbeidsforholdApi } from 'app/types/PleiepengesøknadApiData';
import { calcRedusertProsentFromRedusertTimer } from '../../utils/arbeidsforholdUtils';
import './arbeidsforholdSummary.less';

interface OwnProps {
    arbeidsforhold: ArbeidsforholdApi;
}

const bem = bemUtils('arbeidsforholdSummary');

const ArbeidsforholdSummary: React.FunctionComponent<OwnProps> = ({
    arbeidsforhold: {
        navn,
        organisasjonsnummer,
        skal_jobbe_prosent,
        skal_jobbe_timer,
        jobber_normalt_timer,
        skal_jobbe
    }
}) => {
    const orgInfo = { navn, organisasjonsnummer };
    const intl = useIntl();
    return (
        <div className={bem.block}>
            <div className={bem.element('org')}>
                <FormattedMessage id="arbeidsforhold.oppsummering.orgInfo" values={orgInfo} />
            </div>
            {skal_jobbe === 'redusert' && (
                <div className={bem.element('detaljer')}>
                    {skal_jobbe_timer !== undefined ? (
                        <Normaltekst>
                            <FormattedMessage
                                id={`arbeidsforhold.oppsummering.svar.redusert.timer`}
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
                                id={`arbeidsforhold.oppsummering.svar.redusert.prosent`}
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
                        <FormattedMessage
                            id={`arbeidsforhold.oppsummering.svar.vet_ikke`}
                            values={{ timer: intlHelper(intl, 'timer', { timer: jobber_normalt_timer }) }}
                        />
                    </Normaltekst>
                </div>
            )}
            {skal_jobbe !== 'vet_ikke' && skal_jobbe !== 'redusert' && (
                <div className={bem.element('detaljer')}>
                    <Normaltekst>
                        <FormattedMessage
                            id={`arbeidsforhold.oppsummering.svar.${skal_jobbe}`}
                            values={{ timer: jobber_normalt_timer }}
                        />
                    </Normaltekst>
                </div>
            )}
        </div>
    );
};

export default ArbeidsforholdSummary;
