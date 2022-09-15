import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { dateFormatter } from '@navikt/sif-common-utils/lib';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { RegistrertBarn } from '../../types';
import './innsendtSøknadCard.css';
import InnsendtSøknadIkon from './InnsendtSøknadIkon';

interface Props {
    barn: RegistrertBarn;
    mottattDato: Date;
}

const bem = bemUtils('innsendtSøknadCard');

const InnsendtSøknadCard: React.FunctionComponent<Props> = ({ barn, mottattDato: mottattDato }) => (
    <div className={bem.block}>
        <div className={bem.element('text')}>
            <Element tag="h3">Din forrige søknad</Element>
            <p>
                Du sendte inn en søknad om pleiepenger for {formatName(barn.fornavn, barn.etternavn, barn.mellomnavn)}{' '}
                den {dateFormatter.dateShortMonthYear(mottattDato)}.
            </p>
        </div>
        <div className={bem.element('icon')} role="presentation" aria-hidden="true">
            <InnsendtSøknadIkon />
        </div>
    </div>
);

export default InnsendtSøknadCard;
