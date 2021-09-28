import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import { cleanupArbeidIPeriodeStepData } from './arbeid-i-periode-step-utils';
import ArbeidIPeriodeStepContent from './ArbeidIPeriodeStepContent';

interface Props extends StepConfigProps {
    periode: DateRange;
}

const PlanlagtArbeidStep = ({ onValidSubmit, periode }: Props) => {
    const intl = useIntl();
    const subTitle = intlHelper(intl, 'arbeidIPeriode.subtitle', {
        fra: prettifyDateFull(periode.from),
        til: prettifyDateFull(periode.to),
    });

    return (
        <FormikStep
            id={StepID.ARBEID_PLANLAGT}
            stepSubTitle={subTitle}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupArbeidIPeriodeStepData(values, true)}>
            <ArbeidIPeriodeStepContent stepID={StepID.ARBEID_PLANLAGT} periode={periode} />
        </FormikStep>
    );
};

export default PlanlagtArbeidStep;
