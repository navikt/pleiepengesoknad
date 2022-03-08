import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { Ingress } from 'nav-frontend-typografi';
import FrilansoppdragListe from '../../../components/frilansoppdrag-liste/FrilansoppdragListe';
import { Arbeidsgiver } from '../../../types';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <Box padBottom="m">
        <Ingress>Registrerte frilansoppdrag i perioden:</Ingress>
        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />
        <p style={{ marginTop: 0 }}>
            Dette er frilansoppdrag registrert i AA-registeret i perioden du søker om pleiepenger. Dersom informasjonen
            ikke stemmer, må du ta kontakt med oppdragsgiver og be de oppdatere informasjonen i AA-registeret.
        </p>
    </Box>
);

export default FrilansoppdragInfo;
