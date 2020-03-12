import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import NavLogo from './navLogoSvg';
import './navPrintPage.less';

interface Props {}

const bem = bemUtils('navPrintPage');

const NavPrintPage: React.FunctionComponent<Props> = ({ children }) => (
    <div className={bem.block}>
        <div className={bem.element('logo')}>
            <NavLogo />
        </div>
        {children}
    </div>
);

export default NavPrintPage;
