import React, { useState } from 'react';
import { ArbeidstidPeriodeData, ArbeidstidPeriodeDialog } from '@navikt/sif-common-pleiepenger/lib';
import { ArbeidstidPeriodeFormProps } from '@navikt/sif-common-pleiepenger/lib/arbeidstid-periode/arbeidstid-periode-form/ArbeidstidPeriodeForm';
import { DateDurationMap, DurationWeekdays } from '@navikt/sif-common-utils/lib';
import { Knapp } from 'nav-frontend-knapper';
import { getDagerMedTidFraArbeidstidPeriodeData } from './arbeidstidPeriodeUtils';

interface Props {
    registrerKnappLabel: string;
    formProps: Pick<ArbeidstidPeriodeFormProps, 'arbeidsstedNavn' | 'intlValues' | 'periode'> & {
        jobberNormaltTimerPerUke?: number;
        jobberNormaltTimerFasteDager?: DurationWeekdays;
    };
    onPeriodeChange: (tid: DateDurationMap, formData: ArbeidstidPeriodeData) => void;
}

const ArbeidstidPeriode: React.FunctionComponent<Props> = ({ registrerKnappLabel, formProps, onPeriodeChange }) => {
    const [visPeriode, setVisPeriode] = useState(false);

    const handleFormSubmit = (data: ArbeidstidPeriodeData) => {
        setVisPeriode(false);
        const { jobberNormaltTimerPerUke } = formProps;
        if (jobberNormaltTimerPerUke !== undefined) {
            setTimeout(() => {
                onPeriodeChange(getDagerMedTidFraArbeidstidPeriodeData(jobberNormaltTimerPerUke, data), data);
            });
        } else {
            // TODO- håndtere ukedager
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

export default ArbeidstidPeriode;
