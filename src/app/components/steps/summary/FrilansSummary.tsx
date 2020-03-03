import React from 'react';
import { useIntl } from 'react-intl';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import Box from 'common/components/box/Box';
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
                </>
            )}
        </>
    );
};

export default FrilansSummary;
