import React from 'react';
import { DateRange } from '@navikt/sif-common-formik/lib';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import { ArbeidIPeriodeIntlValues } from '../../søknad/arbeid-i-periode-steps/ArbeidIPeriodeSpørsmål';
import ArbeidstidPeriodeForm, { ArbeidstidPeriodeData } from './ArbeidstidPeriodeForm';
import './arbeidstidPeriode.less';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { useIntl } from 'react-intl';

interface Props {
    isOpen: boolean;
    arbeidsstedNavn: string;
    jobberNormaltTimer: number;
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
    const intl = useIntl();
    return isOpen ? (
        <Modal
            isOpen={isOpen}
            contentLabel={intlHelper(intl, 'arbeidstidPeriodeDialog.contentLabel')}
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
