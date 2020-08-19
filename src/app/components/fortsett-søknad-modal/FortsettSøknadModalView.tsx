import * as React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import Modal from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/modal/Modal';
import Box from 'common/components/box/Box';
import CounsellorPanel from 'common/components/counsellor-panel/CounsellorPanel';
import './fortsettSøknadModalView.less';

interface Props {
    isOpen: boolean;
    buttonsAreDisabled: boolean;
    onRequestClose: () => void;
    onFortsettPåSøknad: () => void;
    onStartNySøknad: () => void;
}

// TODO: Flytte til sif-common-core, og bruke intl
const FortsettSøknadModalView: React.FC<Props> = (props: Props): JSX.Element => {
    const { isOpen, onRequestClose, onFortsettPåSøknad, onStartNySøknad, buttonsAreDisabled } = props;
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={(): void => {
                if (!buttonsAreDisabled) {
                    onRequestClose();
                }
            }}
            contentLabel="Fortsette på påbegynt søknad?"
            shouldCloseOnOverlayClick={false}>
            <div className={'fortsett-soknad-modal-view-wrapper'}>
                <Box padBottom={'xl'}>
                    <CounsellorPanel type={'plakat'} kompakt={true} fargetema={'info'}>
                        <div>
                            Du har en påbegynt søknad hos oss. Du kan velge å fortsette med søknaden som er påbegynt,
                            eller å starte på en ny søknad.
                        </div>
                    </CounsellorPanel>
                </Box>
                <div className={'knappe-wrapper'}>
                    <div className={'knapp-wrapper'}>
                        <Box padBottom={'m'}>
                            <Knapp
                                type={'hoved'}
                                disabled={buttonsAreDisabled}
                                onClick={onFortsettPåSøknad}
                                spinner={buttonsAreDisabled}>
                                Fortsett på søknaden
                            </Knapp>
                        </Box>
                    </div>
                    <div className={'knapp-wrapper'}>
                        <Box padBottom={'m'}>
                            <Knapp
                                type={'hoved'}
                                disabled={buttonsAreDisabled}
                                onClick={onStartNySøknad}
                                spinner={buttonsAreDisabled}>
                                Start ny søknad
                            </Knapp>
                        </Box>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default FortsettSøknadModalView;
