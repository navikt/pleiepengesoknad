import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import NavLogo from './navLogoSvg';
import './navPrintPage.less';

interface Props {
    noTopBorder?: boolean;
}

const bem = bemUtils('navPrintPage');

const NavPrintPage: React.FunctionComponent<Props> = ({ noTopBorder, children }) => (
    <div className={bem.classNames(bem.block, bem.modifierConditional('noTopBorder', noTopBorder))}>
        <div className={bem.element('logo')}>
            <NavLogo />
        </div>
        {children}
    </div>
);

export default NavPrintPage;
