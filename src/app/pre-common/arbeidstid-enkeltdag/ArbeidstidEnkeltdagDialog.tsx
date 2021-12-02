import React from 'react';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import dateFormatter from '../../utils/dateFormatterUtils';
import ArbeidstidEnkeltdagForm, { ArbeidstidEnkeltdagEndring } from './ArbeidstidEnkeltdagForm';
import './arbeidstidEnkeltdag.less';

interface Props {
    isOpen?: boolean;
    dato: Date;
    tid?: Partial<InputTime>;
    arbeidsstedNavn: string;
    periode: DateRange;
    onSubmit: (evt: ArbeidstidEnkeltdagEndring) => void;
    onCancel: () => void;
}

const ArbeidstidEnkeltdagDialog: React.FunctionComponent<Props> = ({
    isOpen = false,
    dato,
    tid,
    arbeidsstedNavn,
    periode,
    onSubmit,
    onCancel,
}) => {
    if (!isOpen) {
        return null;
    }
    const contentLabel = `Arbeidstid ${dateFormatter.fullWithDayName(dato)}`;

    return isOpen ? (
        <>
            <Modal
                isOpen={isOpen}
                contentLabel={contentLabel}
                onRequestClose={onCancel}
                shouldCloseOnOverlayClick={false}
                className="arbeidstidEnkeltdagDialog">
                <ArbeidstidEnkeltdagForm
                    periode={periode}
                    dato={dato}
                    tid={tid}
                    arbeidsstedNavn={arbeidsstedNavn}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Modal>
        </>
    ) : null;
};

export default ArbeidstidEnkeltdagDialog;
