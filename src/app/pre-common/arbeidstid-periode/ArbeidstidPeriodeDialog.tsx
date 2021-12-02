import React from 'react';
import { DateRange } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import ArbeidstidPeriodeForm, { ArbeidstidPeriodeData } from './ArbeidstidPeriodeForm';
import './arbeidstidPeriode.less';
import { ArbeidIPeriodeIntlValues } from '../../søknad/arbeid-i-periode-steps/ArbeidIPeriodeSpørsmål';

interface Props {
    isOpen: boolean;
    arbeidsstedNavn: string;
    periode: DateRange;
    intlValues: ArbeidIPeriodeIntlValues;
    onSubmit: (arbeidstidPeriode: ArbeidstidPeriodeData) => void;
    onCancel: () => void;
}

const ArbeidstidPeriodeDialog: React.FunctionComponent<Props> = ({
    arbeidsstedNavn,
    periode,
    isOpen,
    intlValues,
    onSubmit,
    onCancel,
}) => {
    return isOpen ? (
        <Modal
            isOpen={isOpen}
            contentLabel={`Endre arbeidstid for flere dager`}
            onRequestClose={onCancel}
            shouldCloseOnOverlayClick={false}
            className="arbeidstidPeriodeDialog">
            <Normaltekst tag="div">
                <ArbeidstidPeriodeForm
                    intlValues={intlValues}
                    arbeidsstedNavn={arbeidsstedNavn}
                    rammePeriode={periode}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                />
            </Normaltekst>
        </Modal>
    ) : null;
};

export default ArbeidstidPeriodeDialog;
