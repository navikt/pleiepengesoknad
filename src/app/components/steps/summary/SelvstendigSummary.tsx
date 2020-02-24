import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import {
    getCountryName
} from '@navikt/sif-common/lib/common/components/country-select/CountrySelect';
import { VirksomhetApiData } from '@navikt/sif-common/lib/common/forms/virksomhet/types';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import Box from 'common/components/box/Box';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import DatoSvar from './DatoSvar';
import IntlLabelValue from './IntlLabelValue';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';
import TallSvar from './TallSvar';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const renderVirksomhetSummary = (virksomhet: VirksomhetApiData, intl: IntlShape) => {
    console.log(virksomhet);

    return (
        <SummaryBlock header={virksomhet.navn_pa_virksomheten}>
            <IntlLabelValue labelKey="summary.virksomhet.næringstype">
                {virksomhet.naringstype.map((næring) => intlHelper(intl, `næringstype.${næring}`)).join(', ')}
            </IntlLabelValue>
            <IntlLabelValue labelKey="summary.virksomhet.registrertILand">
                {getCountryName(virksomhet.registrert_i_land || 'NO', intl.locale)}
            </IntlLabelValue>
            {virksomhet.registrert_i_norge && (
                <>
                    <IntlLabelValue labelKey="summary.virksomhet.orgnr">
                        {virksomhet.organisasjonsnummer}
                    </IntlLabelValue>
                </>
            )}
            {virksomhet.fra_og_med && (
                <IntlLabelValue labelKey="summary.virksomhet.opprettet">
                    <DatoSvar apiDato={virksomhet.fra_og_med} />
                    {virksomhet.er_pagaende && (
                        <>
                            {' '}
                            (<FormattedMessage id="summary.virksomhet.pågående" />)
                        </>
                    )}
                </IntlLabelValue>
            )}
            {virksomhet.til_og_med && (
                <IntlLabelValue labelKey="summary.virksomhet.avsluttet">
                    <DatoSvar apiDato={virksomhet.til_og_med} />
                </IntlLabelValue>
            )}
            {virksomhet.har_varig_endring_av_inntekt_siste_4_kalenderar === undefined ? (
                <IntlLabelValue labelKey="summary.virksomhet.inntekt">{virksomhet.naringsinntekt}</IntlLabelValue>
            ) : (
                <IntlLabelValue labelKey="summary.virksomhet.varigEndring">
                    <JaNeiSvar harSvartJa={virksomhet.har_varig_endring_av_inntekt_siste_4_kalenderar} />
                </IntlLabelValue>
            )}
            {virksomhet.har_varig_endring_av_inntekt_siste_4_kalenderar === true && virksomhet.varig_endring?.dato && (
                <>
                    <IntlLabelValue labelKey="summary.virksomhet.varigEndring.dato">
                        <DatoSvar apiDato={virksomhet.varig_endring?.dato} />
                    </IntlLabelValue>
                    <IntlLabelValue labelKey="summary.virksomhet.varigEndring.endretInntekt">
                        <TallSvar verdi={virksomhet.varig_endring.inntekt_etter_endring} />
                    </IntlLabelValue>
                    <IntlLabelValue labelKey="summary.virksomhet.varigEndring.forklaring">
                        {virksomhet.varig_endring.forklaring}
                    </IntlLabelValue>
                </>
            )}
            {virksomhet.har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene !== undefined && (
                <IntlLabelValue labelKey="summary.virksomhet.yrkesaktivSisteTreÅr">
                    <JaNeiSvar harSvartJa={virksomhet.har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene} />
                </IntlLabelValue>
            )}
            {virksomhet.har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene === true &&
                virksomhet.yrkesaktiv_siste_tre_ferdigliknede_arene?.oppstartsdato && (
                    <IntlLabelValue labelKey="summary.virksomhet.yrkesaktivSisteTreÅr.dato">
                        <DatoSvar apiDato={virksomhet.yrkesaktiv_siste_tre_ferdigliknede_arene?.oppstartsdato} />
                    </IntlLabelValue>
                )}

            {/* Regnskapsfører */}
            <IntlLabelValue labelKey="summary.virksomhet.harRegnskapsfører">
                <JaNeiSvar harSvartJa={virksomhet.har_regnskapsforer} />
            </IntlLabelValue>
            {virksomhet.regnskapsforer && (
                <>
                    <IntlLabelValue labelKey="summary.virksomhet.regnskapsfører">
                        <FormattedMessage
                            tagName="span"
                            id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                            values={{ ...virksomhet.regnskapsforer }}
                        />
                    </IntlLabelValue>
                    <IntlLabelValue labelKey="summary.virksomhet.erNærVennEllerFamilie">
                        <JaNeiSvar harSvartJa={virksomhet.regnskapsforer.er_nar_venn_familie} />
                    </IntlLabelValue>
                </>
            )}

            {/* Revisor */}
            {virksomhet.har_regnskapsforer === false && (
                <>
                    <IntlLabelValue labelKey="summary.virksomhet.harRevisor">
                        <JaNeiSvar harSvartJa={virksomhet.har_revisor} />
                    </IntlLabelValue>
                    {virksomhet.revisor && (
                        <>
                            <IntlLabelValue labelKey="summary.virksomhet.revisor">
                                <FormattedMessage
                                    tagName="span"
                                    id="summary.virksomhet.revisorEllerRegnskapsførerDetaljer"
                                    values={{ ...virksomhet.revisor }}
                                />
                            </IntlLabelValue>
                            <IntlLabelValue labelKey="summary.virksomhet.erNærVennEllerFamilie">
                                <JaNeiSvar harSvartJa={virksomhet.revisor.er_nar_venn_familie} />
                            </IntlLabelValue>
                            <IntlLabelValue labelKey="summary.virksomhet.revisor.kanInnhenteOpplysninger">
                                <JaNeiSvar harSvartJa={virksomhet.revisor.kan_innhente_opplysninger} />
                            </IntlLabelValue>
                        </>
                    )}
                </>
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
            {harHattInntekt && (
                <ul>
                    {virksomheter?.map((virksomhet, idx) => (
                        <li key={idx}>{renderVirksomhetSummary(virksomhet, intl)}</li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default SelvstendigSummary;
