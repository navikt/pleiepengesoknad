import React, { useState } from 'react';
import {
    ArbeidstidPeriodeData,
    ArbeidstidPeriodeDialog,
    ArbeidstidPeriodeFormProps,
} from '@navikt/sif-common-pleiepenger';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Knapp } from 'nav-frontend-knapper';
import { getDagerMedTidFraArbeidstidPeriodeData } from './arbeidstidPeriodeUtils';

export type ArbeidstidPeriodeKnappFormProps = Pick<
    ArbeidstidPeriodeFormProps,
    'arbeidsstedNavn' | 'intlValues' | 'periode'
> & {
    arbeiderNormaltTimerPerUke?: number;
    arbeiderNormaltTimerFasteUkedager?: DurationWeekdays;
};

interface Props {
    registrerKnappLabel: string;
    formProps: ArbeidstidPeriodeKnappFormProps;
    onPeriodeChange: (tid: DateDurationMap, formData: ArbeidstidPeriodeData) => void;
}

const ArbeidstidPeriodeKnapp: React.FunctionComponent<Props> = ({
    registrerKnappLabel,
    formProps,
    onPeriodeChange,
}) => {
    const [visPeriode, setVisPeriode] = useState(false);

    const handleFormSubmit = (data: ArbeidstidPeriodeData) => {
        setVisPeriode(false);
        const dagerMedTid = getDagerMedTidFraArbeidstidPeriodeData(data, {
            timerFasteUkedager: formProps.arbeiderNormaltTimerFasteUkedager,
            timerSnittPerUke: formProps.arbeiderNormaltTimerPerUke,
        });
        if (dagerMedTid) {
            setTimeout(() => {
                onPeriodeChange(dagerMedTid, data);
            });
        }
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
