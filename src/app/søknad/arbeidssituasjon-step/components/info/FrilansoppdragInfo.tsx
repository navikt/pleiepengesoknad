import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import { Arbeidsgiver } from '../../../../types';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <Box padBottom="m">
        <FormattedMessage id="frilansoppdragInfo.tittel" values={{ antall: frilansoppdrag.length }} />
        <Box margin="l">
            <FormattedMessage id="frilansoppdragInfo.tittel.1" />
        </Box>

        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />
    </Box>
);

export default FrilansoppdragInfo;
