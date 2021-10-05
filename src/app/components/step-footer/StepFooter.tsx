import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActionLink from '@navikt/sif-common-core/lib/components/action-link/ActionLink';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import './stepFooter.less';

interface Props {
    onAvbryt: () => void;
    onFortsettSenere: () => void;
}

const StepFooter: React.StatelessComponent<Props> = ({ onAvbryt, onFortsettSenere }: Props) => {
    const bem = bemHelper('stepFooter');
    return (
        <div className={bem.block}>
            <div className={bem.element('divider')} />
            <div className={bem.element('links')}>
                <ActionLink onClick={onFortsettSenere}>
                    <FormattedMessage id="steg.footer.fortsettSenere" />
                </ActionLink>
                <span className={bem.element('dot')} aria-hidden={true} />
                <ActionLink className={bem.element('avbrytSoknadLenke')} onClick={onAvbryt}>
                    <FormattedMessage id="steg.footer.avbryt" />
                </ActionLink>
            </div>
        </div>
    );
};

export default StepFooter;
