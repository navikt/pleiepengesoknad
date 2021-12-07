import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import usePersistSoknad from '../../hooks/usePersistSoknad';
import { SøknadFormData } from '../../types/SøknadFormData';
import SøknadFormStep from '../SøknadFormStep';
import HistoriskOmsorgstilbudSpørsmål from './HistoriskOmsorgstilbudSpørsmål';
import { cleanupOmsorgstilbudStep } from './omsorgstilbudStepUtils';
import PlanlagtOmsorgstilbudSpørsmål from './PlanlagtOmsorgstilbudSpørsmål';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import EksempelOmsorgstilbud from './EksempelOmsorgstilbud';
import Alertstripe from 'nav-frontend-alertstriper';
import { søkerKunHelgedager } from '../../utils/formDataUtils';

dayjs.extend(isBetween);

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
            <Box padBottom="xl">
                <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                    <p>
                        <FormattedMessage id="steg.omsorgstilbud.veileder.ny.1" />
                    </p>
                    <p>
                        <FormattedMessage id="steg.omsorgstilbud.veileder.ny.2" />
                    </p>
                    <p>
                        <FormattedMessage id="steg.omsorgstilbud.veileder.ny.3a" />{' '}
                        <strong>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.ny.3b" />
                        </strong>{' '}
                        <FormattedMessage id="steg.omsorgstilbud.veileder.ny.3c" />
                    </p>
                    <p>
                        <FormattedMessage id="steg.omsorgstilbud.veileder.ny.4" />
                    </p>
                    <Box>
                        <EksempelOmsorgstilbud />
                    </Box>
                </CounsellorPanel>
            </Box>
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
                    onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
                    søknadsdato={søknadsdato}
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
                    onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
                    søknadsdato={søknadsdato}
                />
            )}
            {søkerKunHelgedager(values.periodeFra, values.periodeTil) && (
                <Box margin="xl">
                    <Alertstripe type="advarsel">
                        <p>
                            <FormattedMessage id="step.omsorgstilbud.søkerKunHelgedager.alert.avsnitt.1" />
                        </p>
                        <p>
                            <FormattedMessage id="step.omsorgstilbud.søkerKunHelgedager.alert.avsnitt.2" />
                        </p>
                        <p>
                            <FormattedMessage id="step.omsorgstilbud.søkerKunHelgedager.alert.avsnitt.3" />
                        </p>
                    </Alertstripe>
                </Box>
            )}
        </SøknadFormStep>
    );
};

export default OmsorgstilbudStep;
