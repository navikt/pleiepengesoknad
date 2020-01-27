import * as React from 'react';
import classnames from 'classnames';
import { useIntl } from 'react-intl';
import Modal, { ModalProps } from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Systemtittel } from 'nav-frontend-typografi';
import Knapperad from '../../knapperad/Knapperad';
import bemUtils from 'common/utils/bemUtils';
import intlHelper from '../../../utils/intlUtils';

import './bekreftDialog.less';

export interface Props extends ModalProps {
    tittel?: string;
    /** Kalles når bruker klikker bekreft-knapp  */
    onBekreft: () => void;
    /** Kalles når bruker klikker avbryt. Dersom denne ikke settes, brukes onRequestClose fra nav-frontend-modal */
    onAvbryt?: () => void;
    /** Label for bekreft-knapp. Default hentes fra intl: komponent.bekreftDialog.bekreftLabel */
    bekreftLabel?: string;
    /** Label for avbryt-knapp. Default hentes fra intl: komponent.bekreftDialog.avbrytLabel */
    avbrytLabel?: string;
    /** Maks bredde */
    størrelse?: '30';
}
const bem = bemUtils('bekreftDialog');
const BekreftDialog: React.FunctionComponent<Props> = (props) => {
    const intl = useIntl();
    const { tittel,
        onAvbryt,
        onBekreft,
        avbrytLabel, bekreftLabel, children, størrelse, ...modalProps } = props;
    return (
        <Modal
            {...modalProps}
            className={classnames(bem.block, størrelse ? bem.modifier(`size-${størrelse}`) : undefined)}
        >
            {props.isOpen && (
                <>
                    {tittel && <Systemtittel className="blokk-s">{tittel}</Systemtittel>}
                    <div className="blokk-m">{children}</div>
                    <Knapperad>
                        <Hovedknapp onClick={() => onBekreft()} className="bekreftDialog__bekreftKnapp">
                            {bekreftLabel || intlHelper(intl, 'komponent.bekreftDialog.bekreftLabel')}
                        </Hovedknapp>
                        <Knapp onClick={() => onAvbryt ? onAvbryt() : props.onRequestClose()} className="bekreftDialog__avbrytKnapp">
                            {avbrytLabel || intlHelper(intl, 'komponent.bekreftDialog.avbrytLabel')}
                        </Knapp>
                    </Knapperad>
                </>
            )}
        </Modal>
    );
};
export default BekreftDialog;