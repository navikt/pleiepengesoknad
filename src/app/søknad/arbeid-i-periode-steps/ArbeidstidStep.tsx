import React from 'react';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import ArbeidIPeriodeStepContent from './ArbeidIPeriodeStepContent';
import { cleanupArbeidIPeriodeStep } from './utils/cleanupArbeidIPeriodeStep';

interface Props extends StepConfigProps {
    periode: DateRange;
}

const ArbeidstidStep = ({ onValidSubmit, periode }: Props) => {
    return (
        <SøknadFormStep
            id={StepID.ARBEIDSTID}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupArbeidIPeriodeStep(values, periode)}>
            <ArbeidIPeriodeStepContent periode={periode} />
        </SøknadFormStep>
    );
};

export default ArbeidstidStep;
