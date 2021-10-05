import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import CounsellorPanel from '@navikt/sif-common-core/lib/components/counsellor-panel/CounsellorPanel';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { DateRange } from '@navikt/sif-common-formik/lib';
import datepickerUtils from '@navikt/sif-common-formik/lib/components/formik-datepicker/datepickerUtils';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../../../config/stepConfig';
import usePersistSoknad from '../../../hooks/usePersistSoknad';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../../utils/tidsbrukUtils';
import FormikStep from '../../formik-step/FormikStep';
import OmsorgstilbudHistoriskSpørsmål from './OmsorgstilbudHistoriskSpørsmål';
import OmsorgstilbudPlanlagtSpørsmål from './OmsorgstilbudPlanlagtSpørsmål';
import { cleanupOmsorgstilbudStep } from './omsorgstilbudStepUtils';

dayjs.extend(isBetween);

const OmsorgstilbudStep = ({ onValidSubmit }: StepConfigProps) => {
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

    const periodeFra = datepickerUtils.getDateFromDateString(values.periodeFra);
    const periodeTil = datepickerUtils.getDateFromDateString(values.periodeTil);

    if (!periodeFra || !periodeTil) {
        return <div>Perioden mangler, gå tilbake og endre datoer</div>;
    }

    const søknadsperiode: DateRange = { from: periodeFra, to: periodeTil };

    const periodeFørSøknadsdato = getHistoriskPeriode(søknadsperiode, dateToday);
    const periodeFraOgMedSøknadsdato = getPlanlagtPeriode(søknadsperiode, dateToday);

    const harBådeHistoriskOgPlanlagt = periodeFørSøknadsdato !== undefined && periodeFraOgMedSøknadsdato;

    return (
        <FormikStep
            id={StepID.OMSORGSTILBUD}
            onStepCleanup={(values) => cleanupOmsorgstilbudStep(values, søknadsperiode, dateToday)}
            onValidFormSubmit={onValidSubmit}>
            <CounsellorPanel switchToPlakatOnSmallScreenSize={true}>
                <FormattedMessage id="steg.omsorgstilbud.veileder.html" values={{ p: (msg: string) => <p>{msg}</p> }} />
            </CounsellorPanel>
            {periodeFørSøknadsdato && (
                <OmsorgstilbudHistoriskSpørsmål
                    periode={periodeFørSøknadsdato}
                    omsorgstilbud={omsorgstilbud}
                    tittel={intlHelper(
                        intl,
                        harBådeHistoriskOgPlanlagt
                            ? 'steg.omsorgstilbud.historisk.tittel'
                            : 'steg.omsorgstilbud.generelt.tittel'
                    )}
                    onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
                />
            )}
            {periodeFraOgMedSøknadsdato && (
                <OmsorgstilbudPlanlagtSpørsmål
                    periode={periodeFraOgMedSøknadsdato}
                    omsorgstilbud={omsorgstilbud}
                    tittel={intlHelper(
                        intl,
                        harBådeHistoriskOgPlanlagt
                            ? 'steg.omsorgstilbud.planlagt.tittel'
                            : 'steg.omsorgstilbud.generelt.tittel'
                    )}
                    onOmsorgstilbudChanged={() => setOmsorgstilbudChanged(true)}
                />
            )}
        </FormikStep>
    );
};

export default OmsorgstilbudStep;
