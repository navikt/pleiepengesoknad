import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import Sitat from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/Sitat';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import { DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { TidEnkeltdager, TidFasteDager } from '@navikt/sif-common-pleiepenger';
import { SøknadApiData } from '../../../types/søknad-api-data/SøknadApiData';
import {
    søkerFortid,
    søkerFortidFremtid,
    søkerFremtid,
} from '../../../søknad/omsorgstilbud-step/omsorgstilbudStepUtils';

interface Props {
    søknadsperiode: DateRange;
    apiValues: SøknadApiData;
}

const OmsorgstilbudSummary: React.FC<Props> = ({
    apiValues: { nattevåk, beredskap, omsorgstilbud },
    søknadsperiode,
}) => {
    const intl = useIntl();

    return (
        <>
            <SummarySection
                header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.header', {
                    fra: prettifyDateExtended(søknadsperiode.from),
                    til: prettifyDateExtended(søknadsperiode.to),
                })}>
                {omsorgstilbud === undefined && (
                    <>
                        {(søkerFortid(søknadsperiode) || søkerFortidFremtid(søknadsperiode)) && (
                            <SummaryBlock
                                header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.fortid.spm')}
                                headerTag="h3">
                                <FormattedMessage id={`steg.oppsummering.omsorgstilbud.fortid.svar.NEI`} />
                            </SummaryBlock>
                        )}
                        {(søkerFremtid(søknadsperiode) || søkerFortidFremtid(søknadsperiode)) && (
                            <SummaryBlock
                                header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.fremtid.spm')}
                                headerTag="h3">
                                <FormattedMessage id={`steg.oppsummering.omsorgstilbud.fremtid.svar.NEI`} />
                            </SummaryBlock>
                        )}
                    </>
                )}
                {omsorgstilbud !== undefined && omsorgstilbud.svarFortid && (
                    <SummaryBlock
                        header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.fortid.spm')}
                        headerTag="h3">
                        <div data-testid="oppsummering-omsorgstilbud-svarFortid">
                            <FormattedMessage
                                id={`steg.oppsummering.omsorgstilbud.fortid.svar.${omsorgstilbud.svarFortid}`}
                            />
                        </div>
                    </SummaryBlock>
                )}
                {omsorgstilbud !== undefined && omsorgstilbud.svarFremtid && (
                    <SummaryBlock
                        header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.fremtid.spm')}
                        headerTag="h3">
                        <div data-testid="oppsummering-omsorgstilbud-svarFremtid">
                            <FormattedMessage
                                id={`steg.oppsummering.omsorgstilbud.fremtid.svar.${omsorgstilbud.svarFremtid}`}
                            />
                        </div>
                    </SummaryBlock>
                )}
                {omsorgstilbud !== undefined && omsorgstilbud.ukedager && (
                    <SummaryBlock
                        header={intlHelper(
                            intl,
                            søkerFortid(søknadsperiode)
                                ? 'steg.oppsummering.omsorgstilbud.fast.header.fortid'
                                : 'steg.oppsummering.omsorgstilbud.fast.header'
                        )}
                        headerTag="h3">
                        <TidFasteDager fasteDager={omsorgstilbud.ukedager} />
                    </SummaryBlock>
                )}
                {omsorgstilbud !== undefined && omsorgstilbud.enkeltdager && (
                    <SummaryBlock
                        header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.enkeltdager.header')}
                        headerTag="h3">
                        <TidEnkeltdager dager={omsorgstilbud.enkeltdager} />
                    </SummaryBlock>
                )}
            </SummarySection>
            {(nattevåk || beredskap) && (
                <SummarySection header={intlHelper(intl, 'steg.oppsummering.nattevåkBeredskap.header')}>
                    {nattevåk && (
                        <Box margin="xl">
                            <ContentWithHeader header={intlHelper(intl, 'steg.nattevåkOgBeredskap.nattevåk.spm')}>
                                <div data-testid="oppsummering-nattevåk">
                                    <FormattedMessage id={nattevåk.harNattevåk === true ? 'Ja' : 'Nei'} />
                                </div>

                                {nattevåk.harNattevåk === true && nattevåk.tilleggsinformasjon && (
                                    <Sitat>
                                        <div data-testid="oppsummering-nattevåk-tilleggsinformasjon">
                                            <TextareaSummary text={nattevåk.tilleggsinformasjon} />
                                        </div>
                                    </Sitat>
                                )}
                            </ContentWithHeader>
                        </Box>
                    )}
                    {beredskap && (
                        <Box margin="xl">
                            <ContentWithHeader header={intlHelper(intl, 'steg.nattevåkOgBeredskap.beredskap.spm')}>
                                <div data-testid="oppsummering-beredskap">
                                    <FormattedMessage id={beredskap.beredskap === true ? 'Ja' : 'Nei'} />
                                </div>
                                {beredskap.tilleggsinformasjon && (
                                    <Sitat>
                                        <div data-testid="oppsummering-beredskap-tilleggsinformasjon">
                                            <TextareaSummary text={beredskap.tilleggsinformasjon} />
                                        </div>
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
