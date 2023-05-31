import { Button, Heading, Modal, ModalProps } from '@navikt/ds-react';
import ModalContent from '@navikt/ds-react/esm/modal/ModalContent';
import React from 'react';
import { useIntl } from 'react-intl';
import bemUtils from '@navikt/sif-common-core-ds/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import classnames from 'classnames';
import Knapperad from '../knapperad/Knapperad';
import './bekreftDialog.less';

export interface Props extends ModalProps {
    tittel?: string;
    /** Kalles når bruker klikker bekreft-knapp  */
    onBekreft: () => void;
    /** Kalles når bruker klikker avbryt. Dersom denne ikke settes */
    onAvbryt?: () => void;
    /** Label for bekreft-knapp. Default hentes fra intl: komponent.bekreftDialog.bekreftLabel */
    bekreftLabel?: string;
    /** Label for avbryt-knapp. Default hentes fra intl: komponent.bekreftDialog.avbrytLabel */
    avbrytLabel?: string;
    /** Maks bredde */
    størrelse?: '30';
}
const bem = bemUtils('bekreftDialog');
const BekreftDialog = (props: Props) => {
    const intl = useIntl();
    const { tittel, onAvbryt, onBekreft, avbrytLabel, bekreftLabel, children, størrelse, ...modalProps } = props;
    return (
        <Modal
            {...modalProps}
            className={classnames(bem.block, størrelse ? bem.modifier(`size-${størrelse}`) : undefined)}>
            {props.open && (
                <ModalContent>
                    {tittel && (
                        <Heading level="1" size="medium" style={{ paddingRight: '3rem', minWidth: '14rem' }}>
                            {tittel}
                        </Heading>
                    )}
                    <div className="blokk-m">{children}</div>
                    <Knapperad>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={() => onBekreft()}
                            className="bekreftDialog__bekreftKnapp">
                            {bekreftLabel || intlHelper(intl, 'komponent.bekreftDialog.bekreftLabel')}
                        </Button>
                        <Button
                            variant="tertiary"
                            type="button"
                            onClick={() => (onAvbryt ? onAvbryt() : props.onClose())}
                            className="bekreftDialog__avbrytKnapp">
                            {avbrytLabel || intlHelper(intl, 'komponent.bekreftDialog.avbrytLabel')}
                        </Button>
                    </Knapperad>
                </ModalContent>
            )}
        </Modal>
    );
};
export default BekreftDialog;
