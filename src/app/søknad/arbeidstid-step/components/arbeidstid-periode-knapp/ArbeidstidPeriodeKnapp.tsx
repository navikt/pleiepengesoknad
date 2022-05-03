import React, { useState } from 'react';
import {
    ArbeidstidPeriodeData,
    ArbeidstidPeriodeDialog,
    ArbeidstidPeriodeFormProps,
} from '@navikt/sif-common-pleiepenger/lib';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Knapp } from 'nav-frontend-knapper';
import { getDagerMedTidFraArbeidstidPeriodeData } from './arbeidstidPeriodeUtils';

export type ArbeidstidPeriodeKnappFormProps = Pick<
    ArbeidstidPeriodeFormProps,
    'arbeidsstedNavn' | 'intlValues' | 'periode'
> & {
    arbeiderNormaltTimerPerUke?: number;
};

interface Props {
    registrerKnappLabel: string;
    formProps: ArbeidstidPeriodeKnappFormProps;
    arbeiderNormaltTimerFasteUkedager?: DurationWeekdays;
    onPeriodeChange: (tid: DateDurationMap, formData: ArbeidstidPeriodeData) => void;
}

const ArbeidstidPeriodeKnapp: React.FunctionComponent<Props> = ({
    registrerKnappLabel,
    formProps,
    arbeiderNormaltTimerFasteUkedager,
    onPeriodeChange,
}) => {
    const [visPeriode, setVisPeriode] = useState(false);

    const handleFormSubmit = (data: ArbeidstidPeriodeData) => {
        setVisPeriode(false);
        const dagerMedTid = getDagerMedTidFraArbeidstidPeriodeData(data, {
            timerFasteUkedager: arbeiderNormaltTimerFasteUkedager,
            timerSnittPerUke: formProps.arbeiderNormaltTimerPerUke,
        });
        setTimeout(() => {
            onPeriodeChange(dagerMedTid, data);
        });
    };

    return (
        <>
            <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true}>
                {registrerKnappLabel}
            </Knapp>
            <ArbeidstidPeriodeDialog
                formProps={{
                    ...formProps,
                    onCancel: () => setVisPeriode(false),
                    onSubmit: handleFormSubmit,
                }}
                isOpen={visPeriode}
            />
        </>
    );
};

export default ArbeidstidPeriodeKnapp;
