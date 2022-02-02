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
import omsorgstilbudInfo from './info/OmsorgstilbudInfo';
import OmsorgstilbudSpørsmål from './OmsorgstilbudSpørsmål';
import { cleanupOmsorgstilbudStep } from './omsorgstilbudStepUtils';

interface Props {
    søknadsperiode: DateRange;
}

const OmsorgstilbudStep = ({ onValidSubmit, søknadsperiode }: StepConfigProps & Props) => {
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

    return (
        <SøknadFormStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupOmsorgstilbudStep(values, søknadsperiode)}
            onValidFormSubmit={onValidSubmit}>
            <Box padBottom="xl">{omsorgstilbudInfo.stepIntro}</Box>

            <OmsorgstilbudSpørsmål
                periode={søknadsperiode}
                omsorgstilbud={omsorgstilbud}
                tittel={intlHelper(intl, 'steg.omsorgstilbud.generelt.tittel')}
                onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
            />

            {søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <Box margin="xl">{omsorgstilbudInfo.advarselSøkerKunHelgedager}</Box>
            )}
        </SøknadFormStep>
    );
};

export default OmsorgstilbudStep;
