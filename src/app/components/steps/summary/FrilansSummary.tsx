import React from 'react';
import { useIntl } from 'react-intl';
import Box from '@sif-common/core/components/box/Box';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import DatoSvar from './DatoSvar';
import JaNeiSvar from './JaNeiSvar';
import SummaryBlock from './SummaryBlock';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

const FrilansSummary = ({ apiValues }: Props) => {
    const { harHattInntektSomFrilanser, frilans } = apiValues;
    const intl = useIntl();
    return (
        <>
            <Box margin="l">
                <SummaryBlock header={intlHelper(intl, 'frilanser.summary.harDuHattInntekt.header')}>
                    <JaNeiSvar harSvartJa={harHattInntektSomFrilanser} />
                </SummaryBlock>
            </Box>
            {harHattInntektSomFrilanser && frilans !== undefined && (
                <>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.nårStartet.header')}>
                        <DatoSvar apiDato={frilans.startdato} />
                    </SummaryBlock>
                    <SummaryBlock header={intlHelper(intl, 'frilanser.summary.jobberFortsatt.header')}>
                        <JaNeiSvar harSvartJa={frilans.jobberFortsattSomFrilans} />
                    </SummaryBlock>
                </>
            )}
        </>
    );
};

export default FrilansSummary;
