import * as React from 'react';
import bemHelper from 'common/utils/bemUtils';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import ActionLink from 'common/components/action-link/ActionLink';
import './stepFooter.less';

interface Props {
    onAvbryt: () => void;
    onFortsettSenere: () =>  void;
}

const StepFooter: React.StatelessComponent<Props> = ({ onAvbryt, onFortsettSenere }) => {
    const bem = bemHelper('stepFooter');
    return (
        <Normaltekst tag="div" className={bem.block}>
            <div className={bem.element('divider')} />
            <div className={bem.element('links')} >
                <ActionLink onClick={onFortsettSenere}>
                    <FormattedMessage id="steg.footer.fortsettSenere" />
                </ActionLink>
                <span className={bem.element('dot')} aria-hidden={true} />
                <ActionLink className={bem.element('avbrytSoknadLenke')} onClick={onAvbryt}>
                    <FormattedMessage id="steg.footer.avbryt" />
                </ActionLink>
            </div>
        </Normaltekst>
    );
};

export default StepFooter;