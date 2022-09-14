import React, { useEffect, useState } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import { SøknadFormValues } from '../../types/SøknadFormValues';
import { søkerKunHelgedager } from '../../utils/formDataUtils';
import SøknadFormStep from '../SøknadFormStep';
import { StepID } from '../søknadStepsConfig';
import omsorgstilbudInfo from './info/OmsorgstilbudInfo';
import OmsorgstilbudSpørsmål from './OmsorgstilbudSpørsmål';
import { cleanupOmsorgstilbudStep } from './omsorgstilbudStepUtils';
import { UserHashInfo } from '../../api/endpoints/mellomlagringEndpoint';

interface Props {
    søknadsperiode: DateRange;
    søknadId: string;
    søkerInfo: UserHashInfo;
}

const OmsorgstilbudStep = ({ søknadsperiode, søkerInfo, søknadId }: Props) => {
    const { values } = useFormikContext<SøknadFormValues>();
    const { omsorgstilbud } = values;
    const { persistSoknad } = usePersistSoknad();

    const [omsorgstilbudChanged, setOmsorgstilbudChanged] = useState(false);
    useEffect(() => {
        if (omsorgstilbudChanged === true) {
            setOmsorgstilbudChanged(false);
            persistSoknad({ stepID: StepID.OMSORGSTILBUD, søknadId, søkerInfo });
        }
    }, [omsorgstilbudChanged, persistSoknad, søkerInfo, søknadId]);

    return (
        <SøknadFormStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupOmsorgstilbudStep(values, søknadsperiode)}>
            <Box padBottom="xl">{omsorgstilbudInfo.stepIntro}</Box>

            <OmsorgstilbudSpørsmål
                periode={søknadsperiode}
                omsorgstilbud={omsorgstilbud}
                onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
            />

            {søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <Box margin="xl">{omsorgstilbudInfo.advarselSøkerKunHelgedager}</Box>
            )}
        </SøknadFormStep>
    );
};

export default OmsorgstilbudStep;
