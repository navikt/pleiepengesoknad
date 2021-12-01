import React from 'react';
import { DateRange } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import { DagMedTid } from '../../types';
import dateFormatter from '../../utils/dateFormatterUtils';
import ArbeidstidEnkeltdagForm, { ArbeidstidEnkeltdagEndring } from './ArbeidstidEnkeltdagForm';
import './arbeidstidEnkeltdag.less';

interface Props {
    isOpen?: boolean;
    dagMedTid?: DagMedTid;
    arbeidsstedNavn: string;
    søknadsperiode: DateRange;
    onSubmit: (evt: ArbeidstidEnkeltdagEndring) => void;
    onCancel: () => void;
}

const ArbeidstidEnkeltdagDialog: React.FunctionComponent<Props> = ({
    isOpen = false,
    dagMedTid,
    arbeidsstedNavn,
    søknadsperiode,
    onSubmit,
    onCancel,
}) => {
    if (!isOpen) {
        return null;
    }
    const contentLabel = dagMedTid ? `Arbeidstid ${dateFormatter.full(dagMedTid.dato)}` : `Arbeidstid`;

    return isOpen && dagMedTid ? (
        <>
            <Modal
                isOpen={isOpen}
                contentLabel={contentLabel}
                onRequestClose={onCancel}
                shouldCloseOnOverlayClick={false}
                className="arbeidstidEnkeltdagDialog">
                <ArbeidstidEnkeltdagForm
                    endringsperiode={søknadsperiode}
                    dagMedTid={dagMedTid}
                    arbeidsstedNavn={arbeidsstedNavn}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Modal>
        </>
    ) : null;
};

export default ArbeidstidEnkeltdagDialog;
