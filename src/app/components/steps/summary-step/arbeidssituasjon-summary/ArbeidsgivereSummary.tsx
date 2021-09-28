import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsgiverApiData } from '../../../../types/PleiepengesøknadApiData';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';

interface Props {
    arbeidsgivere?: ArbeidsgiverApiData[];
}

const ArbeidsgivereSummary: React.FunctionComponent<Props> = ({ arbeidsgivere }) => {
    const intl = useIntl();
    if (arbeidsgivere === undefined || arbeidsgivere.length === 0) {
        return null;
    }
    return (
        <>
            {arbeidsgivere.map((arbeidsgivver) => {
                return (
                    <SummaryBlock
                        key={arbeidsgivver.organisasjonsnummer}
                        header={`${arbeidsgivver.navn} (organisasjonsnummer ${arbeidsgivver.organisasjonsnummer})`}
                        indentChildren={true}>
                        <SummaryBlock
                            header={intlHelper(intl, 'arbeidsforhold.erAnsatt.spm', { navn: arbeidsgivver.navn })}>
                            <JaNeiSvar harSvartJa={arbeidsgivver.erAnsatt} />
                        </SummaryBlock>
                        <SummaryBlock
                            header={intlHelper(
                                intl,
                                arbeidsgivver.erAnsatt === false
                                    ? 'arbeidsforhold.arbeidsform.avsluttet.spm'
                                    : 'arbeidsforhold.arbeidsform.spm',
                                {
                                    arbeidsforhold: arbeidsgivver.navn,
                                }
                            )}>
                            <FormattedMessage
                                id={`arbeidsforhold.oppsummering.arbeidsform.${arbeidsgivver.arbeidsforhold.arbeidsform}`}
                            />
                        </SummaryBlock>
                        <SummaryBlock
                            header={intlHelper(
                                intl,
                                arbeidsgivver.erAnsatt === false
                                    ? `arbeidsforhold.${arbeidsgivver.arbeidsforhold.arbeidsform}.avsluttet.spm`
                                    : `arbeidsforhold.${arbeidsgivver.arbeidsforhold.arbeidsform}.spm`,
                                {
                                    arbeidsforhold: arbeidsgivver.navn,
                                }
                            )}>
                            <FormattedMessage
                                id="timer.ikkeTall"
                                values={{ timer: arbeidsgivver.arbeidsforhold.jobberNormaltTimer }}
                            />
                        </SummaryBlock>
                    </SummaryBlock>
                );
            })}
        </>
    );
};

export default ArbeidsgivereSummary;
