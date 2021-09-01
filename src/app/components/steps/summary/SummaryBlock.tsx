import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ContentWithHeader from '@navikt/sif-common-core/lib/components/content-with-header/ContentWithHeader';

interface Props {
    header: string;
    children: React.ReactNode;
    headerTag?: 'h1' | 'h2' | 'h3' | 'h4' | string;
}

const SummaryBlock = ({ header, headerTag, children }: Props) => (
    <Box margin="xl">
        <ContentWithHeader header={header} headerTag={headerTag}>
            {children}
        </ContentWithHeader>
    </Box>
);

export default SummaryBlock;
