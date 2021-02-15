import React from 'react';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { Systemtittel } from 'nav-frontend-typografi';
import './formSection.less';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    title: string;
    titleTag?: string;
    titleIcon?: React.ReactNode;
    children: React.ReactNode;
    indentContent?: boolean;
}

const bem = bemUtils('formSection');

const FormSection = ({ title, titleTag, titleIcon, indentContent, children }: Props) => (
    <Box margin="xxl">
        <section className={bem.block}>
            <Systemtittel tag={titleTag} className={bem.element('title')}>
                {titleIcon && <span className={bem.element('titleIcon')}>{titleIcon}</span>}
                {title}
            </Systemtittel>
            <div className={bem.element('content', indentContent ? 'indent' : undefined)}>{children}</div>
        </section>
    </Box>
);
export default FormSection;
