import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Undertittel } from 'nav-frontend-typografi';
import { Arbeidsgiver } from '../../../../types';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <Box padBottom="m">
        <Box padBottom="l">
            <p>
                Du er frilanser dersom du mottar lønn for enkeltstående oppdrag uten å være vast eller midlertidig
                ansatt hos den du utfører oppdraget for. Hvis du er usikker på om du er frilanser kan du sjekke om
                oppdragene dine er registrert som frilansoppdrag på skatteetaten sine sider.
            </p>
            <p>
                Merk at hvis du mottar <strong>omsorgsstønad fra kommunen</strong> eller du mottar{' '}
                <strong>fosterhjemsgodtgjørelse</strong> er dette frilansinntekt og du regnes for å være frilanser
            </p>
        </Box>

        <Undertittel>
            <FormattedMessage id="frilansoppdragInfo.tittel" />
        </Undertittel>
        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />
    </Box>
);

export default FrilansoppdragInfo;
