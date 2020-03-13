import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Undertittel } from 'nav-frontend-typografi';
import './formSection.less';

interface Props {
    title: string;
    titleTag?: string;
    titleIcon?: React.ReactNode;
    indentContent?: boolean;
}

const bem = bemUtils('formSection');

const FormSection: React.FunctionComponent<Props> = ({ title, titleTag, titleIcon, indentContent, children }) => (
    <section className={bem.block}>
        <Undertittel tag={titleTag} className={bem.element('title')}>
            {titleIcon && <span className={bem.element('titleIcon')}>{titleIcon}</span>}
            {title}
        </Undertittel>
        <div className={bem.element('content', indentContent ? 'indent' : undefined)}>{children}</div>
    </section>
);
export default FormSection;
