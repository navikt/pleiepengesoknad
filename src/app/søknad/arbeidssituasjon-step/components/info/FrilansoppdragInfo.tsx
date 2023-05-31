import React from 'react';
import { FormattedMessage } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import FrilansoppdragListe from '../frilansoppdrag-liste/FrilansoppdragListe';
import { Arbeidsgiver } from '../../../../types';

interface Props {
    frilansoppdrag: Arbeidsgiver[];
}

const FrilansoppdragInfo: React.FunctionComponent<Props> = ({ frilansoppdrag }) => (
    <Block padBottom="m">
        <FormattedMessage id="frilansoppdragInfo.tittel" values={{ antall: frilansoppdrag.length }} />
        <Block margin="l">
            <FormattedMessage id="frilansoppdragInfo.tittel.1" />
        </Block>

        <FrilansoppdragListe frilansoppdrag={frilansoppdrag} />
    </Block>
);

export default FrilansoppdragInfo;
