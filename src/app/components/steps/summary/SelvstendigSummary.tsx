import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VirksomhetApiData } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { harFiskerNæringstype } from '@navikt/sif-common-forms/lib/virksomhet/virksomhetUtils';
import { prettifyApiDate } from './DatoSvar';
import IntlLabelValue from './IntlLabelValue';
import JaNeiSvar from './JaNeiSvar';
import Sitat from './Sitat';
import SummaryBlock from './SummaryBlock';

interface Props {
    selvstendigVirksomheter?: VirksomhetApiData[];
}

const renderVirksomhetSummary = (virksomhet: VirksomhetApiData, intl: IntlShape) => {
    const land = virksomhet.registrertIUtlandet ? virksomhet.registrertIUtlandet.landnavn : 'Norge';
    const næringstyper = virksomhet.næringstyper.map((næring) => intlHelper(intl, `næringstype.${næring}`)).join(', ');
    const fiskerinfo =
        harFiskerNæringstype(virksomhet.næringstyper) && virksomhet.fiskerErPåBladB !== undefined
            ? {
                  erPåBladB: virksomhet.fiskerErPåBladB !== undefined && virksomhet.fiskerErPåBladB === true,
              }
            : undefined;

    const tidsinfo = virksomhet.tilOgMed
        ? intlHelper(intl, 'summary.virksomhet.tidsinfo.avsluttet', {
              fraOgMed: prettifyApiDate(virksomhet.fraOgMed),
              tilOgMed: prettifyApiDate(virksomhet.tilOgMed),
          })
        : intlHelper(intl, 'summary.virksomhet.tidsinfo.pågående', {
              fraOgMed: prettifyApiDate(virksomhet.fraOgMed),
          });

    return (
        <SummaryBlock header={virksomhet.navnPåVirksomheten}>
            <IntlLabelValue labelKey="summary.virksomhet.næringstype">{næringstyper}. </IntlLabelValue>
            {fiskerinfo && (
                <>
                    {fiskerinfo.erPåBladB === false ? (
                        <FormattedMessage id="summary.virksomhet.fisker.ikkePåBladB" />
                    ) : (
                        <FormattedMessage id="summary.virksomhet.fisker.påBladB" />
                    )}
                </>
            )}

            <p>
                <FormattedMessage id="summary.virksomhet.registrertILand" values={{ land }} />
                {virksomhet.registrertINorge && (
                    <FormattedMessage
                        id="summary.virksomhet.registrertILand.orgnr"
                        values={{ orgnr: virksomhet.organisasjonsnummer }}
                    />
                )}
                . <br />
                {tidsinfo}
                {virksomhet.næringsinntekt !== undefined && (
                    <>
                        <br />
                        <FormattedMessage
                            id="summary.virksomhet.næringsinntekt"
                            values={{ næringsinntekt: virksomhet.næringsinntekt }}
                        />
                    </>
                )}
            </p>
            {virksomhet.varigEndring?.dato && (
                <Box>
                    <FormattedMessage
                        id="summary.virksomhet.varigEndring"
                        values={{
                            dato: prettifyApiDate(virksomhet.varigEndring.dato),
                            inntekt: intl.formatNumber(virksomhet.varigEndring.inntektEtterEndring),
                        }}
                    />
                    <Sitat>
                        <TextareaSummary text={virksomhet.varigEndring.forklaring} />
                    </Sitat>
                </Box>
            )}
            {virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene?.oppstartsdato !== undefined && (
                <FormattedMessage
                    tagName="p"
                    id="summary.virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene"
                    values={{
                        dato: prettifyApiDate(virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene.oppstartsdato),
                    }}
                />
            )}

            {/* Regnskapsfører */}
            {virksomhet.regnskapsfører && (
                <FormattedMessage
                    tagName="p"
                    id="summary.virksomhet.regnskapsfører"
                    values={{ ...virksomhet.regnskapsfører }}
                />
            )}
            {/** Har ikke regnskapsfører */}
            {!virksomhet.regnskapsfører && <FormattedMessage tagName="p" id="summary.virksomhet.ikkeRegnskapsfører" />}
        </SummaryBlock>
    );
};

function SelvstendigSummary({ selvstendigVirksomheter = [] }: Props) {
    const intl = useIntl();
    const harSelvstendigVirksomheter = selvstendigVirksomheter.length > 0;
    return (
        <>
            <SummaryBlock header={intlHelper(intl, 'selvstendig.summary.harDuHattInntekt.header')}>
                <JaNeiSvar harSvartJa={harSelvstendigVirksomheter} />
            </SummaryBlock>
            {harSelvstendigVirksomheter && (
                <SummaryBlock header="Virksomheter:">
                    <SummaryList
                        items={selvstendigVirksomheter}
                        itemRenderer={(virksomhet) => renderVirksomhetSummary(virksomhet, intl)}
                    />
                </SummaryBlock>
            )}
        </>
    );
}

export default SelvstendigSummary;
