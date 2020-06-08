import React from 'react';
import { FormattedMessage, IntlShape, useIntl, } from 'react-intl';
import { VirksomhetApiData, } from '@navikt/sif-common-forms/lib/virksomhet/types';
import { harFiskerNæringstype, } from '@navikt/sif-common-forms/lib/virksomhet/virksomhetUtils';
import Box from 'common/components/box/Box';
import SummaryList from 'common/components/summary-list/SummaryList';
import TextareaSummary from 'common/components/textarea-summary/TextareaSummary';
import intlHelper from 'common/utils/intlUtils';
import DatoSvar, { prettifyApiDate, } from './DatoSvar';
import IntlLabelValue from './IntlLabelValue';
import JaNeiSvar from './JaNeiSvar';
import Sitat from './Sitat';
import SummaryBlock from './SummaryBlock';
import TallSvar from './TallSvar';

interface Props {
    selvstendigVirksomheter?: VirksomhetApiData[];
}

const renderVirksomhetSummary = (virksomhet: VirksomhetApiData, intl: IntlShape) => {
    const land = virksomhet.registrertIUtlandet || { landnavn: 'Norge' };
    const næringstyper = virksomhet.næringstyper.map((næring) => intlHelper(intl, `næringstype.${næring}`)).join(', ');
    const fiskerinfo =
        harFiskerNæringstype(virksomhet.næringstyper) && virksomhet.fiskerErPåBladB !== undefined
            ? {
                  erPåBladB: virksomhet.fiskerErPåBladB !== undefined && virksomhet.fiskerErPåBladB === true
              }
            : undefined;
    const tidsinfo = `Startet ${prettifyApiDate(virksomhet.fraOgMed)}${
        virksomhet.tilOgMed ? `, avsluttet ${prettifyApiDate(virksomhet.tilOgMed)}.` : ' (pågående).'
    }`;

    return (
        <SummaryBlock header={virksomhet.navnPåVirksomheten}>
            <IntlLabelValue labelKey="summary.virksomhet.næringstype">{næringstyper}. </IntlLabelValue>
            {fiskerinfo && <>Fisker er {fiskerinfo.erPåBladB === false ? 'ikke' : ''} på Blad B.</>}
            <p>
                Registrert i {land.landnavn}
                {virksomhet.registrertINorge ? ` (organisasjonsnummer ${virksomhet.organisasjonsnummer})` : ``}. <br />
                {tidsinfo}
                {virksomhet.næringsinntekt !== undefined && (
                    <>
                        <br />
                        Næringsinntekt: {virksomhet.næringsinntekt}
                    </>
                )}
            </p>
            {virksomhet.varigEndring?.dato && (
                <Box padBottom="l">
                    Har hatt varig endring i arbeidsforholdet, virksomheten eller arbeidssituasjonen de siste fire
                    årene. Dato for endring var <DatoSvar apiDato={virksomhet.varigEndring?.dato} />, og næringsinntekt
                    etter endringen er {` `}
                    <TallSvar verdi={virksomhet.varigEndring.inntektEtterEndring} />. Beskrivelse av endringen:{` `}
                    <Sitat>
                        <TextareaSummary text={virksomhet.varigEndring.forklaring} />
                    </Sitat>
                </Box>
            )}
            {virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene?.oppstartsdato !== undefined && (
                <p>
                    Ble yrkesaktiv <DatoSvar apiDato={virksomhet.yrkesaktivSisteTreFerdigliknedeÅrene?.oppstartsdato} />
                </p>
            )}

            {/* Regnskapsfører */}
            {virksomhet.regnskapsfører && (
                <p>
                    Regnskapsfører er{' '}
                    <FormattedMessage
                        tagName="span"
                        id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                        values={{ ...virksomhet.regnskapsfører }}
                    />
                </p>
            )}
            {/* Revisor */}
            {virksomhet.revisor && (
                <p>
                    Revisor er{' '}
                    <FormattedMessage
                        tagName="span"
                        id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                        values={{ ...virksomhet.revisor }}
                    />
                    {virksomhet.revisor.kanInnhenteOpplysninger === true && (
                        <>
                            <br />
                            Nav har fullmakt til å innhente opplysninger direkte fra revisor.
                        </>
                    )}
                </p>
            )}
            {/** Har hverken revisor eller regnskapsfører */}
            {!virksomhet.regnskapsfører && !virksomhet.revisor && <p>Har ikke regnskapsfører eller revisor.</p>}
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
