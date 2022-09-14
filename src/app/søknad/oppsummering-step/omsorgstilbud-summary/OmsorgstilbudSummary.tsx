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
    apiValues: { nattevåk, beredskap, omsorgstilbud: omsorgstilbud },
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
                        <FormattedMessage
                            id={`steg.oppsummering.omsorgstilbud.fortid.svar.${omsorgstilbud.svarFortid}`}
                        />
                    </SummaryBlock>
                )}
                {omsorgstilbud !== undefined && omsorgstilbud.svarFremtid && (
                    <SummaryBlock
                        header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.fremtid.spm')}
                        headerTag="h3">
                        <FormattedMessage
                            id={`steg.oppsummering.omsorgstilbud.fremtid.svar.${omsorgstilbud.svarFremtid}`}
                        />
                    </SummaryBlock>
                )}
                {omsorgstilbud !== undefined && omsorgstilbud.ukedager && (
                    <SummaryBlock
                        header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.fast.header')}
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
