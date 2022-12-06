import React from 'react';
import { FormattedMessage, IntlShape } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import { Arbeidsgiver } from '../../../../types';
import Alertstripe from 'nav-frontend-alertstriper';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
    intl: IntlShape;
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag, intl }) => (
    <Box padBottom="m">
        <Alertstripe type="info" form="inline">
            <FormattedMessage id="frilansoppdragInfo.tittel" values={{ antall: frilansoppdrag.length }} />
            <Box margin="m">
                <ExpandableInfo
                    title={intlHelper(intl, 'frilansoppdragInfo.expandableInfo.tittel')}
                    filledBackground={false}>
                    <>
                        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />
                        <p style={{ marginTop: 0 }}>
                            <FormattedMessage id="frilansoppdragInfo.tekst" />
                        </p>
                    </>
                </ExpandableInfo>
            </Box>
        </Alertstripe>
    </Box>
);

export default FrilansoppdragInfo;
