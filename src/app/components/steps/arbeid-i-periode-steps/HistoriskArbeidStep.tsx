import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import FormikStep from '../../formik-step/FormikStep';
import { cleanupArbeidIPeriodeStep } from './arbeidIPeriodeStepUtils';
import ArbeidIPeriodeStepContent from './ArbeidIPeriodeStepContent';

interface Props extends StepConfigProps {
    søknadsdato: Date;
    periode: DateRange;
}

const HistoriskArbeidStep = ({ onValidSubmit, periode, søknadsdato }: Props) => {
    const intl = useIntl();
    const subTitle = intlHelper(intl, 'arbeidIPeriode.subtitle', {
        fra: prettifyDateFull(periode.from),
        til: prettifyDateFull(periode.to),
    });

    const erHistorisk = true;
    return (
        <FormikStep
            id={StepID.ARBEID_HISTORISK}
            stepSubTitle={subTitle}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupArbeidIPeriodeStep(values, periode, erHistorisk)}>
            <ArbeidIPeriodeStepContent erHistorisk={erHistorisk} periode={periode} søknadsdato={søknadsdato} />
        </FormikStep>
    );
};

export default HistoriskArbeidStep;