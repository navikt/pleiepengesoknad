import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { ArbeidsforholdApi } from '../../types/PleiepengesøknadApiData';
import { calcRedusertProsentFromRedusertTimer } from '../../utils/arbeidsforholdUtils';
import './arbeidsforholdSummary.less';

interface Props {
    arbeidsforhold: ArbeidsforholdApi;
}

const bem = bemUtils('arbeidsforholdSummary');

const ArbeidsforholdSummary = ({
    arbeidsforhold: {
        navn,
        organisasjonsnummer,
        skalJobbeProsent,
        skalJobbeTimer,
        jobberNormaltTimer,
        skalJobbe,
        arbeidsform,
    },
}: Props) => {
    const orgInfo = { navn, organisasjonsnummer };
    const intl = useIntl();
    return (
        <div className={bem.block}>
            <div className={bem.element('org')}>
                <FormattedMessage id="arbeidsforhold.oppsummering.orgInfo" values={orgInfo} />
            </div>
            {skalJobbe === 'redusert' && jobberNormaltTimer && (
                <div className={bem.element('detaljer')}>
                    {skalJobbeTimer !== undefined ? (
                        <Normaltekst>
                            <FormattedMessage
                                id={`arbeidsforhold.oppsummering.svar.redusert.timer`}
                                values={{
                                    timerRedusert: intlHelper(intl, 'timer', { timer: skalJobbeTimer }),
                                    timerNormalt: intlHelper(intl, 'timer', { timer: jobberNormaltTimer }),
                                    prosentRedusert: calcRedusertProsentFromRedusertTimer(
                                        jobberNormaltTimer,
                                        skalJobbeTimer
                                    ).toFixed(2),
                                }}
                            />
                        </Normaltekst>
                    ) : (
                        <Normaltekst>
                            <FormattedMessage
                                id={`arbeidsforhold.oppsummering.svar.redusert.prosent`}
                                values={{
                                    timerNormalt: intlHelper(intl, 'timer', { timer: jobberNormaltTimer }),
                                    prosentRedusert: skalJobbeProsent,
                                }}
                            />{' '}
                            {jobberNormaltTimer && (
                                <>
                                    <FormattedMessage
                                        id={'arbeidsforhold.oppsummering.jobberNormalt'}
                                        values={{ timer: jobberNormaltTimer }}
                                    />
                                </>
                            )}
                        </Normaltekst>
                    )}
                </div>
            )}
            {skalJobbe === 'vetIkke' && (
                <div className={bem.element('detaljer')}>
                    <Normaltekst>
                        <FormattedMessage
                            id={`arbeidsforhold.oppsummering.svar.vetIkke`}
                            values={{ timer: intlHelper(intl, 'timer', { timer: jobberNormaltTimer }) }}
                        />
                    </Normaltekst>
                </div>
            )}
            {skalJobbe !== 'vetIkke' && skalJobbe !== 'redusert' && (
                <div className={bem.element('detaljer')}>
                    <Normaltekst>
                        <FormattedMessage
                            id={`arbeidsforhold.oppsummering.svar.${skalJobbe}`}
                            values={{ timer: jobberNormaltTimer }}
                        />
                    </Normaltekst>
                </div>
            )}

            <FormattedMessage id={`arbeidsforhold.oppsummering.arbeidsform.${arbeidsform}`} />
        </div>
    );
};

export default ArbeidsforholdSummary;
