import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { ArbeidsforholdSNFApi } from '../../types/PleiepengesøknadApiData';
import { calcRedusertProsentFromRedusertTimer } from '../../utils/arbeidsforholdUtils';
import './arbeidsforholdSNFSummary.less';

interface Props {
    arbeidsforhold: ArbeidsforholdSNFApi;
}

const bem = bemUtils('arbeidsforholdSNFSummary');

const ArbeidsforholdSNFSummary = ({
    arbeidsforhold: { skalJobbeProsent, skalJobbeTimer, jobberNormaltTimer, skalJobbe, arbeidsform },
}: Props) => {
    const intl = useIntl();
    return (
        <div className={bem.block}>
            {skalJobbe === 'redusert' && jobberNormaltTimer && (
                <div className={bem.element('detaljer')}>
                    {skalJobbeTimer !== undefined ? (
                        <Normaltekst>
                            <FormattedMessage
                                id={`arbeidsforhold.oppsummering.svar.redusert.timer`}
                                values={{
                                    timerRedusert: intlHelper(intl, 'timer', { timer: skalJobbeTimer }),
                                    timerNormalt: intlHelper(intl, 'timer', { timer: jobberNormaltTimer }),
                                    prosentRedusert: intl.formatNumber(
                                        calcRedusertProsentFromRedusertTimer(jobberNormaltTimer, skalJobbeTimer),
                                        {
                                            style: 'decimal',
                                        }
                                    ),
                                }}
                            />{' '}
                            <FormattedMessage id={`arbeidsforhold.oppsummering.arbeidsform.${arbeidsform}`} />
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
                            )}{' '}
                            <FormattedMessage id={`arbeidsforhold.oppsummering.arbeidsform.${arbeidsform}`} />
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
                        />{' '}
                        <FormattedMessage id={`arbeidsforhold.oppsummering.arbeidsform.${arbeidsform}`} />
                    </Normaltekst>
                </div>
            )}
            {skalJobbe !== 'vetIkke' && skalJobbe !== 'redusert' && (
                <div className={bem.element('detaljer')}>
                    <Normaltekst>
                        <FormattedMessage
                            id={`arbeidsforhold.oppsummering.svar.${skalJobbe}`}
                            values={{ timer: jobberNormaltTimer }}
                        />{' '}
                        <FormattedMessage id={`arbeidsforhold.oppsummering.arbeidsform.${arbeidsform}`} />
                    </Normaltekst>
                </div>
            )}
        </div>
    );
};

export default ArbeidsforholdSNFSummary;