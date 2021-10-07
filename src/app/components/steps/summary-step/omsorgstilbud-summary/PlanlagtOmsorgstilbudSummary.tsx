import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { VetOmsorgstilbud } from '../../../../types';
import { PlanlagtOmsorgstilbudApiData } from '../../../../types/PleiepengesøknadApiData';
import { getPlanlagtPeriode } from '../../../../utils/tidsbrukUtils';
import JaNeiSvar from '../enkeltsvar/JaNeiSvar';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import TidEnkeltdager from '../../../dager-med-tid/TidEnkeltdager';
import TidFasteDager from '../../../dager-med-tid/TidFasteDager';

interface Props {
    omsorgstilbud?: PlanlagtOmsorgstilbudApiData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

const PlanlagtOmsorgstilbudSummary = ({ omsorgstilbud, søknadsperiode, søknadsdato }: Props) => {
    const intl = useIntl();

    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, søknadsdato);
    if (!periodeFraOgMedSøknadsdato) {
        return null;
    }

    const svar = omsorgstilbud ? 'ja' : 'nei';

    return (
        <>
            <SummaryBlock
                header={intlHelper(intl, 'steg.omsorgstilbud.planlagt.skalBarnetVæreIOmsorgstilbud.spm', {
                    fra: prettifyDateFull(periodeFraOgMedSøknadsdato.from),
                    til: prettifyDateFull(periodeFraOgMedSøknadsdato.to),
                })}>
                <FormattedMessage id={`omsorgstilbud.svar.${svar}`} />
            </SummaryBlock>
            {omsorgstilbud && (
                <>
                    <Box margin="xl">
                        <SummaryBlock header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.hvorMyeTidOms.spm')}>
                            {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_ALLE_TIMER && (
                                <>
                                    <FormattedMessage
                                        id={`steg.oppsummering.omsorgstilbud.hvorMyeTidOms.${omsorgstilbud.vetOmsorgstilbud}`}
                                    />
                                </>
                            )}

                            {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_IKKE && (
                                <>
                                    <FormattedMessage
                                        id={`steg.oppsummering.omsorgstilbud.hvorMyeTidOms.${omsorgstilbud.vetOmsorgstilbud}`}
                                    />
                                </>
                            )}
                        </SummaryBlock>
                        {omsorgstilbud.vetOmsorgstilbud === VetOmsorgstilbud.VET_ALLE_TIMER && (
                            <>
                                {omsorgstilbud.erLiktHverUke !== undefined && (
                                    <SummaryBlock
                                        header={intlHelper(intl, 'steg.omsorgstilbud.planlagt.erLiktHverUke.spm')}>
                                        <JaNeiSvar harSvartJa={omsorgstilbud.erLiktHverUke} />
                                    </SummaryBlock>
                                )}
                                <SummaryBlock
                                    header={intlHelper(intl, 'steg.oppsummering.omsorgstilbud.planlagt.header')}
                                    headerTag="h3">
                                    {omsorgstilbud.ukedager && <TidFasteDager fasteDager={omsorgstilbud.ukedager} />}
                                    {omsorgstilbud.enkeltdager && <TidEnkeltdager dager={omsorgstilbud.enkeltdager} />}
                                </SummaryBlock>
                            </>
                        )}
                    </Box>
                </>
            )}
        </>
    );
};
export default PlanlagtOmsorgstilbudSummary;
