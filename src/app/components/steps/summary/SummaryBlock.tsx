import React from 'react';
import Box from 'common/components/box/Box';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';

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
