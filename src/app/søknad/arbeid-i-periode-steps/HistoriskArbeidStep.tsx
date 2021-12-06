import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import SøknadFormStep from '../SøknadFormStep';
import { cleanupArbeidIPeriodeStep } from './utils/cleanupArbeidIPeriodeStep';
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
        <SøknadFormStep
            id={StepID.ARBEID_HISTORISK}
            stepSubTitle={subTitle}
            onValidFormSubmit={onValidSubmit}
            onStepCleanup={(values) => cleanupArbeidIPeriodeStep(values, periode, erHistorisk)}>
            <ArbeidIPeriodeStepContent erHistorisk={erHistorisk} periode={periode} søknadsdato={søknadsdato} />
        </SøknadFormStep>
    );
};

export default HistoriskArbeidStep;
