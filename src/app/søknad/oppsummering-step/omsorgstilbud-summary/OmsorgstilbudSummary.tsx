import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import Sitat from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/Sitat';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { TidEnkeltdager, TidFasteDager } from '@navikt/sif-common-pleiepenger';
import { OmsorgstilbudSvar, SøknadApiData } from '../../../types/søknad-api-data/SøknadApiData';

interface Props {
    søknadsperiode: DateRange;
    apiValues: SøknadApiData;
}

const OmsorgstilbudSummary: React.FC<Props> = ({ apiValues: { nattevåk, beredskap, omsorgstilbud } }) => {
    const intl = useIntl();
    console.log('omsorgstilbud: ', omsorgstilbud);
    return (
        <>
            <SummarySection header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.header')}>
                {omsorgstilbud.svar === OmsorgstilbudSvar.IKKE_OMSORGSTILBUD && (
                    <SummaryBlock header={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.spm')}>
                        <FormattedMessage id={`omsorgstilbud.svar.IKKE_OMSORGSTILBUD`} />
                    </SummaryBlock>
                )}

                {omsorgstilbud.svar === OmsorgstilbudSvar.IKKE_FAST_OG_REGELMESSIG && (
                    <>
                        <SummaryBlock header={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.spm')}>
                            <FormattedMessage id={`omsorgstilbud.svar.IKKE_FAST_OG_REGELMESSIG`} />
                        </SummaryBlock>
                    </>
                )}
                {omsorgstilbud.svar === OmsorgstilbudSvar.FAST_OG_REGELMESSIG && omsorgstilbud.ukedager && (
                    <>
                        <SummaryBlock header={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.spm')}>
                            <FormattedMessage id={`omsorgstilbud.svar.FAST_OG_REGELMESSIG`} />
                        </SummaryBlock>
                        <SummaryBlock
                            header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.fast.header')}
                            headerTag="h3">
                            <TidFasteDager fasteDager={omsorgstilbud.ukedager} />
                        </SummaryBlock>
                    </>
                )}
                {(omsorgstilbud.svar === OmsorgstilbudSvar.FAST_OG_REGELMESSIG ||
                    omsorgstilbud.svar === OmsorgstilbudSvar.DELVIS_FAST_OG_REGELMESSIG) &&
                    omsorgstilbud.enkeltdager && (
                        <>
                            <SummaryBlock header={intlHelper(intl, 'steg.omsorgstilbud.erIOmsorgstilbud.spm')}>
                                <FormattedMessage id={`omsorgstilbud.svar.${omsorgstilbud.svar}`} />
                            </SummaryBlock>
                            <SummaryBlock
                                header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.enkeltdager.header')}
                                headerTag="h3">
                                <TidEnkeltdager dager={omsorgstilbud.enkeltdager} />
                            </SummaryBlock>
                        </>
                    )}
            </SummarySection>
            {(nattevåk || beredskap) && (
                <SummarySection header={intlHelper(intl, 'steg.oppsummering.nattevåkBeredskap.header')}>
                    {nattevåk && (
                        <Box margin="xl">
                            <ContentWithHeader header={intlHelper(intl, 'steg.nattevåkOgBeredskap.nattevåk.spm')}>
                                {nattevåk.harNattevåk === true && intlHelper(intl, 'Ja')}
                                {nattevåk.harNattevåk === false && intlHelper(intl, 'Nei')}
                                {nattevåk.harNattevåk === true && nattevåk.tilleggsinformasjon && (
                                    <Sitat>
                                        <TextareaSummary text={nattevåk.tilleggsinformasjon} />
                                    </Sitat>
                                )}
                            </ContentWithHeader>
                        </Box>
                    )}
                    {beredskap && (
                        <Box margin="xl">
                            <ContentWithHeader header={intlHelper(intl, 'steg.nattevåkOgBeredskap.beredskap.spm')}>
                                {beredskap.beredskap === true && intlHelper(intl, 'Ja')}
                                {beredskap.beredskap === false && intlHelper(intl, 'Nei')}
                                {beredskap.tilleggsinformasjon && (
                                    <Sitat>
                                        <TextareaSummary text={beredskap.tilleggsinformasjon} />
                                    </Sitat>
                                )}
                            </ContentWithHeader>
                        </Box>
                    )}
                </SummarySection>
            )}
        </>
    );
};

export default OmsorgstilbudSummary;
