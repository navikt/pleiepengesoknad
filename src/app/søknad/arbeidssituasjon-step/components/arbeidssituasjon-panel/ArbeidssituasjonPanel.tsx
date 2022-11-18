import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import './arbeidssituasjonPanel.less';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';

interface Props {
    title: string;
    description?: JSX.Element;
    tag?: string;
    titleIcon?: React.ReactNode;
    children: React.ReactNode;
    deleteButton?: JSX.Element;
}

const bem = bemUtils('arbeidssituasjonPanel');
const bemItem = bem.child('title');
const ArbeidssituasjonPanel = ({ title, description, tag = 'h3', titleIcon, children, deleteButton }: Props) => (
    <ResponsivePanel className={bem.block} style={{ padding: '1rem', paddingBottom: '1.7rem' }}>
        <div className={bemItem.block}>
            {titleIcon && <div className={bemItem.element('icon')}>{titleIcon}</div>}
            <div className={bemItem.element('text')}>
                <Undertittel tag={tag}>{title}</Undertittel>
            </div>
            {deleteButton !== undefined && <div className={bemItem.element('button')}>{deleteButton}</div>}
        </div>
        {description !== undefined && <div className={bem.element('description')}>{description}</div>}
        <div className={bem.element('content')}>{children}</div>
    </ResponsivePanel>
);

export default ArbeidssituasjonPanel;
