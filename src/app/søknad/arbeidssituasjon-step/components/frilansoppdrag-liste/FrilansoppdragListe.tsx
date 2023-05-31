import React from 'react';
import { FormattedMessage } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import { prettifyDateExtended } from '@navikt/sif-common-utils';
import { Element } from 'nav-frontend-typografi';
import { Arbeidsgiver } from '../../../../types';
import ArbeidssituasjonPanel from '../arbeidssituasjon-panel/ArbeidssituasjonPanel';
import FrilansIconSvg from '../../../../components/frilans-icon/FrilansIconSvg';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

export const renderTidsrom = ({ ansattFom, ansattTom }: Arbeidsgiver) => {
    if (ansattFom && ansattTom) {
        return (
            <FormattedMessage
                id="frilansoppdragListe.tidsrom.avsluttet"
                values={{ fra: prettifyDateExtended(ansattFom), til: prettifyDateExtended(ansattTom) }}
            />
        );
    }
    if (ansattFom) {
        return (
            <FormattedMessage
                id="frilansoppdragListe.tidsrom.pågående"
                values={{ fra: prettifyDateExtended(ansattFom) }}
            />
        );
    }
    return undefined;
};

const FrilansoppdragListe: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <ArbeidssituasjonPanel title="Frilansoppdrag registrert på deg:" titleIcon={<FrilansIconSvg />}>
        <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
            {frilansoppdrag.map((oppdrag) => (
                <li key={oppdrag.id}>
                    <Element tag="h4">{oppdrag.navn}</Element>
                    <Block padBottom="l">{renderTidsrom(oppdrag)}</Block>
                </li>
            ))}
        </ul>
    </ArbeidssituasjonPanel>
);

export default FrilansoppdragListe;
