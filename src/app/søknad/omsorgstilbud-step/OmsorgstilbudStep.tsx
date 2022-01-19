import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import { SøknadFormData } from '../../types/SøknadFormData';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import SøknadFormStep from '../SøknadFormStep';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import HistoriskOmsorgstilbudSpørsmål from './HistoriskOmsorgstilbudSpørsmål';
import omsorgstilbudInfo from './info/OmsorgstilbudInfo';
import { cleanupOmsorgstilbudStep } from './omsorgstilbudStepUtils';
import PlanlagtOmsorgstilbudSpørsmål from './PlanlagtOmsorgstilbudSpørsmål';

interface Props {
    søknadsdato: Date;
    søknadsperiode: DateRange;
    periodeFørSøknadsdato?: DateRange;
    periodeFraOgMedSøknadsdato?: DateRange;
}

const OmsorgstilbudStep = ({
    onValidSubmit,
    søknadsdato,
    periodeFørSøknadsdato,
    periodeFraOgMedSøknadsdato,
    søknadsperiode,
}: StepConfigProps & Props) => {
    const intl = useIntl();
    const history = useHistory();
    const { values } = useFormikContext<SøknadFormData>();
    const { omsorgstilbud } = values;
    const { persist } = usePersistSoknad(history);

    const [omsorgstilbudChanged, setOmsorgstilbudChanged] = useState(false);
    useEffect(() => {
        if (omsorgstilbudChanged === true) {
            setOmsorgstilbudChanged(false);
            persist(StepID.OMSORGSTILBUD);
        }
    }, [omsorgstilbudChanged, persist]);

    const harBådeHistoriskOgPlanlagt = periodeFørSøknadsdato !== undefined && periodeFraOgMedSøknadsdato !== undefined;

    return (
        <SøknadFormStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupOmsorgstilbudStep(values, søknadsperiode, søknadsdato)}
            onValidFormSubmit={onValidSubmit}>
            <Box padBottom="xl">{omsorgstilbudInfo.stepIntro}</Box>
            {periodeFørSøknadsdato && (
                <HistoriskOmsorgstilbudSpørsmål
                    periode={periodeFørSøknadsdato}
                    omsorgstilbud={omsorgstilbud}
                    tittel={intlHelper(
                        intl,
                        harBådeHistoriskOgPlanlagt
                            ? 'steg.omsorgstilbud.historisk.tittel'
                            : 'steg.omsorgstilbud.generelt.tittel'
                    )}
                    harBådeHistoriskOgPlanlagt={harBådeHistoriskOgPlanlagt}
                    onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
                />
            )}
            {periodeFraOgMedSøknadsdato && (
                <PlanlagtOmsorgstilbudSpørsmål
                    periode={periodeFraOgMedSøknadsdato}
                    omsorgstilbud={omsorgstilbud}
                    tittel={intlHelper(
                        intl,
                        harBådeHistoriskOgPlanlagt
                            ? 'steg.omsorgstilbud.planlagt.tittel'
                            : 'steg.omsorgstilbud.generelt.tittel'
                    )}
                    harBådeHistoriskOgPlanlagt={harBådeHistoriskOgPlanlagt}
                    onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
                />
            )}

            {søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <Box margin="xl">{omsorgstilbudInfo.advarselSøkerKunHelgedager}</Box>
            )}
        </SøknadFormStep>
    );
};

export default OmsorgstilbudStep;
