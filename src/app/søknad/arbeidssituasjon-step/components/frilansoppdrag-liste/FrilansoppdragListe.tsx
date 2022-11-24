import React from 'react';
import { FormattedMessage } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { Element } from 'nav-frontend-typografi';
import { Arbeidsgiver } from '../../../../types';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const renderTidsrom = ({ ansattFom, ansattTom }: Arbeidsgiver) => {
    if (ansattFom && ansattTom) {
        return (
            <FormattedMessage
                id="frilansoppdragListe.tidsrom.avsluttet"
                values={{ fra: prettifyDateFull(ansattFom), til: prettifyDateFull(ansattTom) }}
            />
        );
    }
    if (ansattFom) {
        return (
            <FormattedMessage id="frilansoppdragListe.tidsrom.pågående" values={{ fra: prettifyDateFull(ansattFom) }} />
        );
    }
    return null;
};

const FrilansoppdragListe: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <ul style={{ margin: 0, padding: '1rem 0 0 1rem' }}>
        {frilansoppdrag.map((oppdrag) => (
            <li key={oppdrag.id}>
                <Element tag="h4">{oppdrag.navn}</Element>
                <Box padBottom="l">
                    <FormattedMessage id="frilansoppdragListe.oppdrag" values={{ tidsrom: renderTidsrom(oppdrag) }} />
                </Box>
            </li>
        ))}
    </ul>
);

export default FrilansoppdragListe;
