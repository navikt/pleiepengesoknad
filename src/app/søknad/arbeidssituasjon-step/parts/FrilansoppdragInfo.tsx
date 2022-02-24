import React from 'react';
import { prettifyDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Arbeidsgiver } from '../../../types';
import { Element, Ingress } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const renderTidsrom = ({ ansattFom, ansattTom }: Arbeidsgiver) => {
    if (ansattFom && ansattTom) {
        return (
            <>
                fra {prettifyDateExtended(ansattFom)} til {prettifyDateExtended(ansattTom)}
            </>
        );
    }
    if (ansattFom) {
        return <>fra {prettifyDate(ansattFom)} - pågående</>;
    }
    return null;
};

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <>
        <p>
            Nedenfor ser du frilansoppdrag registrert i AA-registeret i perioden du søker om pleiepenger. Dersom
            informasjonen over ikke stemmer, må du ta kontakt med oppdragsgiver og be dem oppdatere informasjonen i
            AA-registeret.
        </p>
        <Box margin="xl">
            <Ingress tag="h4">Frilansoppdrag</Ingress>
        </Box>
        <Box padBottom="m">
            <ul>
                {frilansoppdrag.map((oppdrag) => (
                    <li key={oppdrag.id}>
                        <Element tag="div">{oppdrag.navn}</Element>
                        Periode: {renderTidsrom(oppdrag)}
                    </li>
                ))}
            </ul>
        </Box>
    </>
);

export default FrilansoppdragInfo;
