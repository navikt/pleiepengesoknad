import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Undertittel } from 'nav-frontend-typografi';
import { Arbeidsgiver } from '../../../../types';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <>
        <Box padBottom="l">
            <p>
                Du har frilansoppdrag registrert i AA-registeret i perioden du søker om pleiepenger. Merk at hvis du
                mottar <strong>omsorgsstønad</strong> eller <strong>fosterhjemsgodtgjørelse</strong> er dette
                frilansinntekt og du regnes for å være frilanser når du mottar dette.
            </p>
        </Box>

        <Undertittel>
            <FormattedMessage id="frilansoppdragInfo.tittel" />
        </Undertittel>

        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />

        <Box margin="l">
            <ExpandableInfo title="Informasjonen over stemmer ikke">
                <p>
                    Hvis du mottar lønn for enkeltstående oppdrag uten å være fast eller midlertidig ansatt hos den du
                    utfører oppdraget for, er du frilanser. Hvis du er usikker på om du er frilanser kan du sjekke om
                    oppdragene dine er registrert som frilansoppdrag på skatteetaten sine sider (lenke, ikke fet).
                </p>
                <p>
                    Dersom du er sikker på at informasjonen her ikke stemmer, må du ta kontakt med oppdragsgiver og be
                    de oppdatere informasjonen i AA-registeret.
                </p>
            </ExpandableInfo>
        </Box>
    </>
);

export default FrilansoppdragInfo;
