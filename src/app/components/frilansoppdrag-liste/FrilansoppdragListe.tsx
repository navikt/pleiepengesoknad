import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { prettifyDate, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { Arbeidsgiver } from '../../types';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
    kompakt?: boolean;
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

const FrilansoppdragListe: React.FunctionComponent<Props> = ({ frilansoppdrag, kompakt }) =>
    kompakt ? (
        <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
            {frilansoppdrag.map((oppdrag) => (
                <li key={oppdrag.id}>{oppdrag.navn}</li>
            ))}
        </ul>
    ) : (
        <ul style={{ margin: 0, padding: '1rem 0 0 1rem' }}>
            {frilansoppdrag.map((oppdrag) => (
                <li key={oppdrag.id}>
                    <Element tag="h4">{oppdrag.navn}</Element>
                    <Box padBottom="l">Periode: {renderTidsrom(oppdrag)}</Box>
                </li>
            ))}
        </ul>
    );

export default FrilansoppdragListe;
