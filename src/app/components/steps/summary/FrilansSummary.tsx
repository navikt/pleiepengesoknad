import React from 'react';
import Box from 'common/components/box/Box';
import { PleiepengesøknadApiData, FrilansoppdragApiData } from 'app/types/PleiepengesøknadApiData';
import JaNeiSvar from './JaNeiSvar';
import SummaryList from 'common/components/summary-list/SummaryList';
import DatoSvar from './DatoSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const FrilansSummary: React.FunctionComponent<Props> = ({ apiValues }) => {
    const { har_hatt_inntekt_som_frilanser, frilans } = apiValues;
    return (
        <>
            <Box margin="l">
                <SummaryBlock header="Har hatt inntekst som frilanser siste 10 månedene">
                    <JaNeiSvar harSvartJa={har_hatt_inntekt_som_frilanser} />
                </SummaryBlock>
            </Box>
            {har_hatt_inntekt_som_frilanser && frilans !== undefined && (
                <>
                    <SummaryBlock header="Når startet du som frilanser">
                        <DatoSvar apiDato={frilans.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header="Jobber du fortsatt som frilanser?">
                        <JaNeiSvar harSvartJa={frilans.jobber_fortsatt_som_frilans} />
                    </SummaryBlock>
                    <SummaryBlock header="Har du hatt oppdrag for nær venn eller familie de 10 siste månedene?">
                        <JaNeiSvar harSvartJa={frilans.har_hatt_oppdrag_for_familie} />
                    </SummaryBlock>
                    {frilans.har_hatt_oppdrag_for_familie && (
                        <SummaryBlock header="Frilansoppdrag">
                            <SummaryList
                                itemRenderer={(oppdrag: FrilansoppdragApiData) => (
                                    <div>
                                        {oppdrag.arbeidsgivernavn} - fra {<DatoSvar apiDato={oppdrag.fra_og_med} />}
                                        {oppdrag.til_og_med === null ? (
                                            ' (pågående)'
                                        ) : (
                                            <>
                                                til{` `}
                                                <DatoSvar apiDato={oppdrag.til_og_med} />
                                            </>
                                        )}
                                    </div>
                                )}
                                items={frilans.oppdrag || []}
                            />
                        </SummaryBlock>
                    )}
                    <SummaryBlock header="Har du inntekt som fosterforelder?">
                        <JaNeiSvar harSvartJa={frilans.har_hatt_inntekt_som_fosterforelder} />
                    </SummaryBlock>
                </>
            )}
        </>
    );
};

export default FrilansSummary;
