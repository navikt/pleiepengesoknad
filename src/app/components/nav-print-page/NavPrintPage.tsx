import React from 'react';
import bemUtils from '@sif-common/core/utils/bemUtils';
import NavLogo from './navLogoSvg';
import './navPrintPage.less';

interface Props {
    children: React.ReactNode;
    noTopBorder?: boolean;
}

const bem = bemUtils('navPrintPage');

const NavPrintPage = ({ noTopBorder, children }: Props) => (
    <div className={bem.classNames(bem.block, bem.modifierConditional('noTopBorder', noTopBorder))}>
        <div className={bem.element('logo')}>
            <NavLogo />
        </div>
        {children}
    </div>
);

export default NavPrintPage;
