import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import SummaryBlock from '@navikt/sif-common-soknad-ds/lib/components/summary-block/SummaryBlock';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import VirksomhetSummary from '@navikt/sif-common-forms-ds/lib/forms/virksomhet/VirksomhetSummary';
import { Element } from 'nav-frontend-typografi';
import { SelvstendigApiData } from '../../../types/søknad-api-data/SøknadApiData';
import NormalarbeidstidSummary from './NormalarbeidstidSummary';

interface Props {
    selvstendig: SelvstendigApiData;
}

function ArbeidssituasjonSelvstendigSummary({ selvstendig }: Props) {
    const intl = useIntl();
    return (
        <div data-testid="arbeidssituasjon-sn">
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.selvstendig.header')}>
                {selvstendig.harInntektSomSelvstendig === false && (
                    <ul>
                        <li>
                            <FormattedMessage id={'oppsummering.arbeidssituasjon.selvstendig.erIkkeSN'} tagName="p" />
                        </li>
                    </ul>
                )}
                {selvstendig.harInntektSomSelvstendig && (
                    <>
                        <ul>
                            <li>
                                <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.erSn" />
                            </li>
                            <li>
                                {selvstendig.virksomhet.harFlereAktiveVirksomheter ? (
                                    <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.flereVirksomheter" />
                                ) : (
                                    <FormattedMessage id="oppsummering.arbeidssituasjon.selvstendig.enVirksomhet" />
                                )}
                            </li>
                            <li>
                                <NormalarbeidstidSummary
                                    normalarbeidstidApiData={selvstendig.arbeidsforhold.normalarbeidstid}
                                    erAnsatt={true}
                                />
                            </li>
                        </ul>
                        <Element tag="h4">{intlHelper(intl, 'summary.virksomhet.virksomhetInfo.tittel')}</Element>
                        <Block margin="m">
                            <div style={{ paddingLeft: '1rem' }}>
                                <VirksomhetSummary virksomhet={selvstendig.virksomhet} />
                            </div>
                        </Block>
                    </>
                )}
            </SummaryBlock>
        </div>
    );
}

export default ArbeidssituasjonSelvstendigSummary;
