import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import BehandlingAvPersonopplysningerContent from '../../pages/welcoming-page/behandling-av-personopplysninger-content/BehandlingAvPersonopplysningerContent';
import { Undertittel } from 'nav-frontend-typografi';

const OmSøknaden = () => {
    return (
        <Box margin="xl">
            <Undertittel tag="h3">Om søknaden</Undertittel>
            <p>Du får veiledning underveis i søknaden om hva du skal fylle ut, og hvordan. </p>
            <p>
                Vi tar vare på svarene dine i 72 timer. Så, hvis du innenfor den tiden for eksempel vil ta en pause
                eller blir automatisk logget ut, fortsetter du der du var når du kommer tilbake.
            </p>
            <p>
                Du må svare på alle spørsmålene for å kunne gå videre. Hvis du mangler etterspurt dokumentasjon, kan du
                ettersende det så snart du kan.
            </p>
            <ExpandableInfo title="Om hvordan vi innhenter opplysninger om deg">
                <BehandlingAvPersonopplysningerContent />
            </ExpandableInfo>
        </Box>
    );
};

export default OmSøknaden;
