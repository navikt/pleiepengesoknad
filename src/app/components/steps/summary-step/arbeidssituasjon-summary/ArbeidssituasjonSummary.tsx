import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { PleiepengesøknadApiData } from '../../../../types/PleiepengesøknadApiData';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import SummarySection from '../../../summary-section/SummarySection';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const ArbeidssituasjonSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende },
}) => {
    const intl = useIntl();
    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
            {arbeidsgivere && arbeidsgivere.length > 0 && (
                <>
                    {arbeidsgivere.map((a) => {
                        return (
                            <FormBlock key={a.organisasjonsnummer}>
                                <Element tag="h3">
                                    {a.navn} (organisasjonsnummer {a.organisasjonsnummer})
                                </Element>
                                <div style={{ paddingLeft: '2rem' }}>
                                    <SummaryBlock
                                        header={intlHelper(intl, 'arbeidsforhold.erAnsatt.spm', { navn: a.navn })}>
                                        <JaNeiSvar harSvartJa={a.erAnsatt} />
                                    </SummaryBlock>
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            a.erAnsatt === false
                                                ? 'arbeidsforhold.arbeidsform.avsluttet.spm'
                                                : 'arbeidsforhold.arbeidsform.spm',
                                            {
                                                arbeidsforhold: a.navn,
                                            }
                                        )}>
                                        <FormattedMessage
                                            id={`arbeidsforhold.oppsummering.arbeidsform.${a.arbeidsforhold.arbeidsform}`}
                                        />
                                    </SummaryBlock>
                                    <SummaryBlock
                                        header={intlHelper(
                                            intl,
                                            a.erAnsatt === false
                                                ? `arbeidsforhold.${a.arbeidsforhold.arbeidsform}.avsluttet.spm`
                                                : `arbeidsforhold.${a.arbeidsforhold.arbeidsform}.spm`,
                                            {
                                                arbeidsforhold: a.navn,
                                            }
                                        )}>
                                        <FormattedMessage
                                            id="timer.ikkeTall"
                                            values={{ timer: a.arbeidsforhold.jobberNormaltTimer }}
                                        />
                                    </SummaryBlock>
                                </div>
                            </FormBlock>
                        );
                    })}
                    {frilans?.arbeidsforhold && (
                        <FormBlock>
                            <Element tag="h3">
                                <FormattedMessage id="arbeidsforhold.oppsummering.frilanser" />
                            </Element>
                            <div style={{ paddingLeft: '2rem' }}>
                                <SummaryBlock
                                    header={intlHelper(
                                        intl,
                                        frilans.arbeidsforhold.erAktivtArbeidsforhold === false
                                            ? 'frilans.arbeidsforhold.arbeidsform.avsluttet.spm'
                                            : 'frilans.arbeidsforhold.arbeidsform.spm'
                                    )}>
                                    <FormattedMessage
                                        id={`arbeidsforhold.oppsummering.arbeidsform.${frilans.arbeidsforhold.arbeidsform}`}
                                    />
                                </SummaryBlock>
                                <SummaryBlock
                                    header={intlHelper(
                                        intl,
                                        frilans.arbeidsforhold.erAktivtArbeidsforhold === false
                                            ? `snFrilanser.arbeidsforhold.${frilans.arbeidsforhold.arbeidsform}.avsluttet.spm`
                                            : `snFrilanser.arbeidsforhold.${frilans.arbeidsforhold.arbeidsform}.spm`
                                    )}>
                                    <FormattedMessage
                                        id="timer.ikkeTall"
                                        values={{ timer: frilans.arbeidsforhold.jobberNormaltTimer }}
                                    />
                                </SummaryBlock>
                            </div>
                        </FormBlock>
                    )}
                    {selvstendigNæringsdrivende?.arbeidsforhold && (
                        <FormBlock>
                            <Element tag="h3">
                                <FormattedMessage id="arbeidsforhold.oppsummering.selvstendig" />
                            </Element>
                            <div style={{ paddingLeft: '2rem' }}>
                                <SummaryBlock
                                    header={intlHelper(
                                        intl,
                                        selvstendigNæringsdrivende.arbeidsforhold.erAktivtArbeidsforhold === false
                                            ? 'selvstendig.arbeidsforhold.arbeidsform.avsluttet.spm'
                                            : 'selvstendig.arbeidsforhold.arbeidsform.spm'
                                    )}>
                                    <FormattedMessage
                                        id={`arbeidsforhold.oppsummering.arbeidsform.${selvstendigNæringsdrivende.arbeidsforhold.arbeidsform}`}
                                    />
                                </SummaryBlock>
                                <SummaryBlock
                                    header={intlHelper(
                                        intl,
                                        selvstendigNæringsdrivende.arbeidsforhold.erAktivtArbeidsforhold === false
                                            ? `snFrilanser.arbeidsforhold.${selvstendigNæringsdrivende.arbeidsforhold.arbeidsform}.avsluttet.spm`
                                            : `snFrilanser.arbeidsforhold.${selvstendigNæringsdrivende.arbeidsforhold.arbeidsform}.spm`
                                    )}>
                                    <FormattedMessage
                                        id="timer.ikkeTall"
                                        values={{
                                            timer: selvstendigNæringsdrivende.arbeidsforhold.jobberNormaltTimer,
                                        }}
                                    />
                                </SummaryBlock>
                            </div>
                        </FormBlock>
                    )}
                </>
            )}
        </SummarySection>
    );
};

export default ArbeidssituasjonSummary;
