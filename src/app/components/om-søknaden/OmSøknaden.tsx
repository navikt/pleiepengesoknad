import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import BehandlingAvPersonopplysningerContent from '../../pages/welcoming-page/behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';

const OmSøknaden = () => {
    return (
        <Box margin="xl">
            <ExpandableInfo title="Om hvordan vi innhenter opplysninger om deg">
                <BehandlingAvPersonopplysningerContent />
            </ExpandableInfo>
        </Box>
    );
};

export default OmSøknaden;
