import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import {
    getCountryName
} from '@navikt/sif-common/lib/common/components/country-select/CountrySelect';
import SummaryList from '@navikt/sif-common/lib/common/components/summary-list/SummaryList';
import TextareaSummary from '@navikt/sif-common/lib/common/components/textarea-summary/TextareaSummary';
import { VirksomhetApiData } from '@navikt/sif-common/lib/common/forms/virksomhet/types';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import Box from 'common/components/box/Box';
import { harFiskerNæringstype } from 'common/forms/virksomhet/virksomhetUtils';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import DatoSvar, { prettifyApiDate } from './DatoSvar';
import IntlLabelValue from './IntlLabelValue';
import JaNeiSvar from './JaNeiSvar';
import Sitat from './Sitat';
import SummaryBlock from './SummaryBlock';
import TallSvar from './TallSvar';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const renderVirksomhetSummary = (virksomhet: VirksomhetApiData, intl: IntlShape) => {
    const land = getCountryName(virksomhet.registrert_i_land || 'NO', intl.locale);
    const næringstyper = virksomhet.naringstype.map((næring) => intlHelper(intl, `næringstype.${næring}`)).join(', ');
    const fiskerinfo = harFiskerNæringstype(virksomhet.naringstype)
        ? {
              erPåPlaneB: virksomhet.fiskerErPåBladB === true
          }
        : undefined;
    const tidsinfo = `Startet ${prettifyApiDate(virksomhet.fra_og_med)}${
        virksomhet.til_og_med ? `, avsluttet ${prettifyApiDate(virksomhet.fra_og_med)}.` : ' (pågående).'
    }`;

    return (
        <SummaryBlock header={virksomhet.navn_pa_virksomheten}>
            <IntlLabelValue labelKey="summary.virksomhet.næringstype">{næringstyper}</IntlLabelValue>
            {fiskerinfo && (
                <IntlLabelValue labelKey="summary.virksomhet.fiskerErPåBladB">
                    <JaNeiSvar harSvartJa={fiskerinfo.erPåPlaneB} />
                </IntlLabelValue>
            )}
            <p>
                Registrert i {land}
                {virksomhet.registrert_i_norge ? ` (organisasjonsnummer ${virksomhet.organisasjonsnummer})` : ``}.{' '}
                <br />
                {tidsinfo}
            </p>
            {virksomhet.har_varig_endring_av_inntekt_siste_4_kalenderar === true && virksomhet.varig_endring?.dato && (
                <Box padBottom="l">
                    Har hatt varig endring i arbeidsforholdet, virksomheten eller arbeidssituasjonen de siste fire
                    årene. Dato for endring var <DatoSvar apiDato={virksomhet.varig_endring?.dato} />, og næringsinntekt
                    etter endringen er {` `}
                    <TallSvar verdi={virksomhet.varig_endring.inntekt_etter_endring} />. Beskrivelse av endringen:{` `}
                    <Sitat>
                        <TextareaSummary text={virksomhet.varig_endring.forklaring} />
                    </Sitat>
                </Box>
            )}
            {virksomhet.yrkesaktiv_siste_tre_ferdigliknede_arene?.oppstartsdato !== undefined && (
                <p>
                    Ble yrkesaktiv{' '}
                    <DatoSvar apiDato={virksomhet.yrkesaktiv_siste_tre_ferdigliknede_arene?.oppstartsdato} />
                </p>
            )}

            {/* Regnskapsfører */}
            {virksomhet.regnskapsforer && (
                <p>
                    Regnskapsfører er
                    <FormattedMessage
                        tagName="span"
                        id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                        values={{ ...virksomhet.regnskapsforer }}
                    />
                </p>
            )}
            {/* Revisor */}
            {virksomhet.har_regnskapsforer === false && virksomhet.revisor && (
                <p>
                    Revisor er
                    <FormattedMessage
                        tagName="span"
                        id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                        values={{ ...virksomhet.revisor }}
                    />
                    {virksomhet.revisor.kan_innhente_opplysninger === true && (
                        <>
                            <br />
                            Nav har fullmakt til å innhente opplysninger direkte fra revisor.
                        </>
                    )}
                </p>
            )}
            {/** Har hverken revisor eller regnskapsfører */}
            {virksomhet.har_regnskapsforer === false && virksomhet.har_revisor === false && (
                <p>Har ikke regnskapsfører eller revisor.</p>
            )}
        </SummaryBlock>
    );
};

const SelvstendigSummary: React.FunctionComponent<Props> = ({ apiValues }) => {
    const {
        har_hatt_inntekt_som_selvstendig_naringsdrivende: harHattInntekt,
        selvstendig_virksomheter: virksomheter
    } = apiValues;
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <SummaryBlock header={intlHelper(intl, 'selvstendig.summary.harDuHattInntekt.header')}>
                    <JaNeiSvar harSvartJa={harHattInntekt} />
                </SummaryBlock>
            </Box>
            {harHattInntekt && virksomheter && (
                <SummaryList
                    items={virksomheter}
                    itemRenderer={(virksomhet) => renderVirksomhetSummary(virksomhet, intl)}
                />
            )}
        </>
    );
};

export default SelvstendigSummary;
