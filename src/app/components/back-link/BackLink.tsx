import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Back } from '@navikt/ds-icons';
import bemUtils from '@navikt/sif-common-core-ds/lib/utils/bemUtils';
import Lenke from 'nav-frontend-lenker';
import './backLink.less';

interface BackLinkProps {
    className?: string;
    href: string;
    ariaLabel?: string;
}

type Props = BackLinkProps;
const bem = bemUtils('backLink');
const BackLink = ({ className, href, ariaLabel }: Props) => {
    const navigate = useNavigate();
    return (
        <div className={`${bem.block} ${className}`}>
            <Lenke
                className={bem.element('link')}
                href={href}
                ariaLabel={ariaLabel}
                onClick={(evt) => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    navigate(href);
                }}>
                <Back className={bem.element('chevron')} type="venstre" />
                <FormattedMessage id="backlink.label" />
            </Lenke>
        </div>
    );
};

export default BackLink;
