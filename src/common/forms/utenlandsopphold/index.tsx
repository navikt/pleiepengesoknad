import React from 'react';
import FieldsetBase from '../../form-components/fieldset-base/FieldsetBase';
import { Utenlandsopphold } from './types';
import Box from '../../components/box/Box';
import { Knapp } from 'nav-frontend-knapper';
import Modal from '../../components/modal/Modal';
import UtenlandsoppholdForm from './UtenlandsoppholdForm';
import { DateRange } from '../../utils/dateUtils';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { guid } from 'nav-frontend-js-utils';
import bemUtils from '../../utils/bemUtils';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import UtenlandsoppholdListe from './UtenlandsoppholdListe';

import './utenlandsoppholdListe.less';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    labels: {
        tittel: string;
        helpertext?: string;
    };
    tidsrom: DateRange;
    feil?: SkjemaelementFeil;
    utenlandsopphold: Utenlandsopphold[];
    onChange: (utenlandsopphold: Utenlandsopphold[]) => void;
}

const bem = bemUtils('utenlandsoppholdListe');

const sortUtenlandsopphold = (u1: Utenlandsopphold, u2: Utenlandsopphold): number => {
    if (moment(u1.fromDate).isSameOrBefore(u2.fromDate)) {
        return -1;
    }
    return 1;
};

const UtenlandsoppholdMain: React.FunctionComponent<Props & InjectedIntlProps> = ({
    labels,
    utenlandsopphold,
    onChange,
    tidsrom,
    feil,
    intl
}) => {
    const [modalState, setModalState] = React.useState<{ isVisible: boolean; utenlandsopphold?: Utenlandsopphold }>({
        isVisible: false
    });

    const handleOnSubmit = (values: Utenlandsopphold) => {
        if (values.id) {
            onChange([...utenlandsopphold.filter((u) => u.id !== values.id), values]);
        } else {
            onChange([...utenlandsopphold, { id: guid(), ...values }].sort(sortUtenlandsopphold));
        }
        setModalState({ isVisible: false });
    };

    const handleEditUtenlandsopphold = (opphold: Utenlandsopphold) => {
        setModalState({ isVisible: true, utenlandsopphold: opphold });
    };

    const handleDeleteUtenlandsopphold = (opphold: Utenlandsopphold) => {
        onChange([...utenlandsopphold.filter((u) => u.id !== opphold.id)]);
    };

    const resetModal = () => {
        setModalState({ isVisible: false, utenlandsopphold: undefined });
    };

    return (
        <div className={bem.block}>
            <Modal
                isOpen={modalState.isVisible}
                contentLabel={intlHelper(intl, 'utenlandsopphold.modal.title')}
                onRequestClose={resetModal}>
                <UtenlandsoppholdForm
                    minDate={tidsrom.from}
                    maxDate={tidsrom.to}
                    onCancel={resetModal}
                    onSubmit={handleOnSubmit}
                    values={modalState.utenlandsopphold}
                />
            </Modal>
            <FieldsetBase legend={labels.tittel} helperText={labels.helpertext} feil={feil}>
                <UtenlandsoppholdListe
                    utenlandsopphold={utenlandsopphold}
                    onDelete={handleDeleteUtenlandsopphold}
                    onEdit={handleEditUtenlandsopphold}
                />
                <Box margin="m">
                    <Knapp htmlType="button" onClick={() => setModalState({ isVisible: true })}>
                        <FormattedMessage id="utenlandsopphold.list.add" />
                    </Knapp>
                </Box>
            </FieldsetBase>
        </div>
    );
};

export default injectIntl(UtenlandsoppholdMain);
