import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Ingress } from 'nav-frontend-typografi';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import { Arbeidsgiver } from '../../../../types';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <Box padBottom="m">
        <Ingress>
            <FormattedMessage id="frilansoppdragInfo.tittel" />
        </Ingress>
        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />
        <p style={{ marginTop: 0 }}>
            <FormattedMessage id="frilansoppdragInfo.tekst" />
        </p>
    </Box>
);

export default FrilansoppdragInfo;
