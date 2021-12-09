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
    jobberNormaltTimer: string;
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
    jobberNormaltTimer,
    onSubmit,
    onCancel,
}) => {
    return isOpen ? (
        <Modal
            isOpen={isOpen}
            contentLabel={`Legg til arbeidstid for flere dager`}
            onRequestClose={onCancel}
            shouldCloseOnOverlayClick={false}
            className="arbeidstidPeriodeDialog">
            <Normaltekst tag="div">
                <ArbeidstidPeriodeForm
                    jobberNormaltTimer={jobberNormaltTimer}
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
