import React from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import { Arbeidsgiver } from '../../../../types';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
    intl: IntlShape;
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag, intl }) => (
    <Box padBottom="m">
        <FormattedMessage id="frilansoppdragInfo.tittel" values={{ antall: frilansoppdrag.length }} />
        <Box margin="m">
            <ExpandableInfo
                title={intlHelper(intl, 'frilansoppdragInfo.expandableInfo.tittel')}
                filledBackground={false}>
                <>
                    <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />
                    <p style={{ marginTop: 0 }}>
                        <FormattedMessage id="frilansoppdragInfo.tekst.1" />
                    </p>

                    <FormattedMessage id="frilansoppdragInfo.tekst.2" />
                </>
            </ExpandableInfo>
        </Box>
    </Box>
);

export default FrilansoppdragInfo;
