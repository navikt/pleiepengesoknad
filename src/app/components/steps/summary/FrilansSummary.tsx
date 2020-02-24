import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { FrilansoppdragApiData } from '@navikt/sif-common/lib/common/forms/frilans/types';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import Box from 'common/components/box/Box';
import SummaryList from 'common/components/summary-list/SummaryList';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import DatoSvar from './DatoSvar';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const FrilansSummary: React.FunctionComponent<Props> = ({ apiValues }) => {
    const { har_hatt_inntekt_som_frilanser, frilans } = apiValues;
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <SummaryBlock header={intlHelper(intl, 'frilanser.summary.harDuHattInntekt.header')}>
                    <JaNeiSvar harSvartJa={har_hatt_inntekt_som_frilanser} />
                </SummaryBlock>
            </Box>
            {har_hatt_inntekt_som_frilanser && frilans !== undefined && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårStartet.header')}>
                        <DatoSvar apiDato={frilans.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.jobberFortsatt.header')}>
                        <JaNeiSvar harSvartJa={frilans.jobber_fortsatt_som_frilans} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.oppdragFamilieVenner.header')}>
                        <JaNeiSvar harSvartJa={frilans.har_hatt_oppdrag_for_familie} />
                    </SummaryBlock>
                    {frilans.har_hatt_oppdrag_for_familie && (
                        <SummaryBlock header={intlHelper(intl, 'frilanser.summary.list.tittel')}>
                            <SummaryList
                                itemRenderer={(oppdrag: FrilansoppdragApiData) => (
                                    <div>
                                        {oppdrag.arbeidsgivernavn} - fra {<DatoSvar apiDato={oppdrag.fra_og_med} />}
                                        {oppdrag.til_og_med === null ? (
                                            <>
                                                {' '}
                                                (<FormattedMessage id="frilanser.summary.list.pågående" />)
                                            </>
                                        ) : (
                                            <>
                                                <FormattedMessage id="frilanser.summary.list.til" />{' '}
                                                <DatoSvar apiDato={oppdrag.til_og_med} />
                                            </>
                                        )}
                                    </div>
                                )}
                                items={frilans.oppdrag || []}
                            />
                        </SummaryBlock>
                    )}
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.inntektFosterforelder.header')}>
                        <JaNeiSvar harSvartJa={frilans.har_hatt_inntekt_som_fosterforelder} />
                    </SummaryBlock>
                </>
            )}
        </>
    );
};

export default FrilansSummary;
