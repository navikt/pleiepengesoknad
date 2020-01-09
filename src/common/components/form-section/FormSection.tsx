import React from 'react';
import bemUtils from 'common/utils/bemUtils';
import { Undertittel } from 'nav-frontend-typografi';
import './formSection.less';

interface Props {
    title: string;
}

const bem = bemUtils('formSection');

const FormSection: React.FunctionComponent<Props> = ({ title, children }) => (
    <section className={bem.block}>
        <Undertittel>{title}</Undertittel>
        <div className={bem.element('content')}>{children}</div>
    </section>
);

export default FormSection;
