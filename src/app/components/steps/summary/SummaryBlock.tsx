import React from 'react';
import Box from '@sif-common/core/components/box/Box';
import ContentWithHeader from '@sif-common/core/components/content-with-header/ContentWithHeader';

interface Props {
    header: string;
    children: React.ReactNode;
}

const SummaryBlock = ({ header, children }: Props) => (
    <Box margin="l">
        <ContentWithHeader header={header}>{children}</ContentWithHeader>
    </Box>
);

export default SummaryBlock;
