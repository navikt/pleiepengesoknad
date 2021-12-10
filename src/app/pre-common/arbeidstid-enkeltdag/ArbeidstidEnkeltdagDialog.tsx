import React from 'react';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import dateFormatter from '../../utils/common/dateFormatterUtils';
import ArbeidstidEnkeltdagForm, { ArbeidstidEnkeltdagEndring } from './ArbeidstidEnkeltdagForm';
import './arbeidstidEnkeltdag.less';
import { ArbeidsforholdType } from '../../types';

interface Props {
    isOpen?: boolean;
    dato: Date;
    tid?: Partial<InputTime>;
    arbeidsstedNavn: string;
    periode: DateRange;
    arbeidsforholdType: ArbeidsforholdType;
    onSubmit: (evt: ArbeidstidEnkeltdagEndring) => void;
    onCancel: () => void;
}

const ArbeidstidEnkeltdagDialog: React.FunctionComponent<Props> = ({
    isOpen = false,
    dato,
    tid,
    arbeidsstedNavn,
    arbeidsforholdType,
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
                    arbeidsforholdType={arbeidsforholdType}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Modal>
        </>
    ) : null;
};

export default ArbeidstidEnkeltdagDialog;
