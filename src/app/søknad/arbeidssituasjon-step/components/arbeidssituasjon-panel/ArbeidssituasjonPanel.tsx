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
    deleteButton?: JSX.Element;
}

const bem = bemUtils('arbeidssituasjonPanel');
const bemItem = bem.child('content');
const ArbeidssituasjonPanel = ({ title, description, tag = 'h3', titleIcon, children, deleteButton }: Props) => (
    <ResponsivePanel className={bem.block} style={{ padding: '1rem', paddingBottom: '1.7rem' }}>
        {titleIcon && <div className={bemItem.element('icon')}>{titleIcon}</div>}
        <div className={bemItem.block}>
            <Undertittel tag={tag}>{title}</Undertittel>
            {description && <FormattedMessage id="frilansoppdragListe.oppdrag" values={{ tidsrom: description }} />}
            <div className={bemItem.element('child')}>{children}</div>
        </div>
        {deleteButton !== undefined && <div className={bemItem.element('button')}>{deleteButton}</div>}
    </ResponsivePanel>
);

export default ArbeidssituasjonPanel;
