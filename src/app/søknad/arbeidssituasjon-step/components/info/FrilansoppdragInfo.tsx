import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Undertittel } from 'nav-frontend-typografi';
import { Arbeidsgiver } from '../../../../types';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import Lenke from 'nav-frontend-lenker';
import getLenker from '../../../../lenker';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => {
    const intl = useIntl();
    return (
        <>
            <Box padBottom="l">
                <p>
                    <FormattedMessage id="frilansoppdragInfo.intro" />
                </p>
            </Box>

            <Undertittel>
                <FormattedMessage id="frilansoppdragInfo.tittel" />
            </Undertittel>

            <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />

            <Box margin="l">
                <ExpandableInfo title={intlHelper(intl, 'frilansoppdragListe.info.tittel')}>
                    <p>
                        <FormattedMessage id="frilansoppdragListe.info.tekst.1" />
                    </p>
                    <p>
                        <FormattedMessage id="frilansoppdragListe.info.tekst.2.a" />{' '}
                        <Lenke href={getLenker('nb').skatteetaten} target="_blank">
                            <FormattedMessage id="frilansoppdragListe.info.tekst.2.b" />
                        </Lenke>{' '}
                        <FormattedMessage id="frilansoppdragListe.info.tekst.2.c" />
                    </p>
                </ExpandableInfo>
            </Box>
        </>
    );
};

export default FrilansoppdragInfo;
