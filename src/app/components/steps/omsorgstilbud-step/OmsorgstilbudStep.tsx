import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
// import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import usePersistSoknad from '../../../hooks/usePersistSoknad';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
// import { getHistoriskPeriode, getPlanlagtPeriode } from '../../../utils/tidsbrukUtils';
import FormikStep from '../../formik-step/FormikStep';
import HistoriskOmsorgstilbudSpørsmål from './HistoriskOmsorgstilbudSpørsmål';
import PlanlagtOmsorgstilbudSpørsmål from './PlanlagtOmsorgstilbudSpørsmål';
import { cleanupOmsorgstilbudStep } from './omsorgstilbudStepUtils';

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
    const { values } = useFormikContext<PleiepengesøknadFormData>();
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
    const kunHistorisk = periodeFørSøknadsdato && periodeFraOgMedSøknadsdato === undefined;

    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupOmsorgstilbudStep(values, søknadsperiode, søknadsdato)}
            onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                {kunHistorisk && (
                    <>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.historisk.1" />
                        </p>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.historisk.2" />
                        </p>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.historisk.3" />
                        </p>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.historisk.4" />
                        </p>
                    </>
                )}
                {kunHistorisk === false && (
                    <>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.1" />
                        </p>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.2" />
                        </p>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.3" />
                        </p>
                        <p>
                            <FormattedMessage id="steg.omsorgstilbud.veileder.4" />
                        </p>
                    </>
                )}
            </CounsellorPanel>
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
        </FormikStep>
    );
};

export default OmsorgstilbudStep;
