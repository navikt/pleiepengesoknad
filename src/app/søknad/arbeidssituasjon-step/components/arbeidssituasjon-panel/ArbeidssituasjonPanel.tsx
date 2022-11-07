import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import './arbeidssituasjonPanel.less';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
//import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { FormattedMessage } from 'react-intl';

interface Props {
    title: string;
    description?: JSX.Element;
    tag?: string;
    titleIcon?: React.ReactNode;
    children: React.ReactNode;
}

const bem = bemUtils('arbeidssituasjonPanel');

const ArbeidssituasjonPanel = ({ title, description, tag, titleIcon, children }: Props) => (
    <ResponsivePanel className={bem.block} style={{ padding: '1rem' }}>
        <Undertittel tag={tag} className={bem.element('title')}>
            {titleIcon && <div className={bem.element('titleIcon')}>{titleIcon}</div>}
            {title}
        </Undertittel>
        {description && (
            <div className={bem.element('description')}>
                <FormattedMessage id="frilansoppdragListe.oppdrag" values={{ tidsrom: description }} />
            </div>
        )}
        <div className={bem.element('content')}>{children}</div>{' '}
    </ResponsivePanel>
);

export default ArbeidssituasjonPanel;
