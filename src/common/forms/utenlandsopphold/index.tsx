import React from 'react';
import FieldsetBase from '../../form-components/fieldset-base/FieldsetBase';
import { Utenlandsopphold } from './types';
import Box from '../../components/box/Box';
import { Knapp } from 'nav-frontend-knapper';
import Modal from '../../components/modal/Modal';
import UtenlandsoppholdForm, { UtenlandsoppholdFormLabels } from './UtenlandsoppholdForm';
import { DateRange } from '../../utils/dateUtils';
import { useIntl, FormattedMessage } from 'react-intl';
import moment from 'moment';
import { guid } from 'nav-frontend-js-utils';
import bemUtils from '../../utils/bemUtils';
import { SkjemaelementFeil } from 'nav-frontend-skjema/lib/skjemaelement-feilmelding';
import UtenlandsoppholdListe from './UtenlandsoppholdListe';
import intlHelper from 'common/utils/intlUtils';

import './utenlandsoppholdListe.less';

interface Props {
    labels: {
        listeTittel: string;
        helpertext?: string;
        formLabels?: Partial<UtenlandsoppholdFormLabels>;
    };
    tidsrom: DateRange;
    feil?: SkjemaelementFeil;
    utenlandsopphold: Utenlandsopphold[];
    spørOmÅrsakVedOppholdIEØSLand?: boolean;
    onChange: (utenlandsopphold: Utenlandsopphold[]) => void;
}

const bem = bemUtils('utenlandsoppholdListe');

const sortUtenlandsopphold = (u1: Utenlandsopphold, u2: Utenlandsopphold): number => {
    if (moment(u1.fromDate).isSameOrBefore(u2.fromDate)) {
        return -1;
    }
    return 1;
};

const UtenlandsoppholdInput: React.FunctionComponent<Props> = ({
    labels,
    utenlandsopphold,
    onChange,
    tidsrom,
    spørOmÅrsakVedOppholdIEØSLand,
    feil
}) => {
    const intl = useIntl();
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

    const sortedUtenlandsoppholdList = [...utenlandsopphold].sort(sortUtenlandsopphold);

    return (
        <div className={bem.block}>
            <Modal
                isOpen={modalState.isVisible}
                contentLabel={intlHelper(intl, 'utenlandsopphold.modal.title')}
                onRequestClose={resetModal}>
                <UtenlandsoppholdForm
                    labels={labels.formLabels}
                    minDate={tidsrom.from}
                    maxDate={tidsrom.to}
                    onCancel={resetModal}
                    onSubmit={handleOnSubmit}
                    values={modalState.utenlandsopphold}
                    reasonNeeded={spørOmÅrsakVedOppholdIEØSLand}
                />
            </Modal>
            <FieldsetBase legend={labels.listeTittel} helperText={labels.helpertext} feil={feil}>
                <UtenlandsoppholdListe
                    utenlandsopphold={sortedUtenlandsoppholdList}
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

export default UtenlandsoppholdInput;
