import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { DateRange, getNumberFromNumberInputValue, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { Knapp } from 'nav-frontend-knapper';
import ArbeidstidPeriodeDialog from '../../../pre-common/arbeidstid-periode/ArbeidstidPeriodeDialog';
import { ArbeidstidPeriodeData } from '../../../pre-common/arbeidstid-periode/ArbeidstidPeriodeForm';
import { getDatesInDateRange } from '../../../utils/common/dateRangeUtils';
import { dateToISODate, ISODateToDate } from '../../../utils/common/isoDateUtils';
import useLogSøknadInfo from '../../../hooks/useLogSøknadInfo';
import { DatoTidMap } from '../../../types';
import { getRedusertArbeidstidSomInputTime } from '../../../utils/formToApiMaps/tidsbrukApiUtils';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';
import { getTidForUkedag } from '../../../utils/datoTidUtils';

interface Props {
    intlValues: ArbeidIPeriodeIntlValues;
    jobberNormaltTimer: number;
    arbeidsstedNavn: string;
    periode: DateRange;
    onPeriodeChange: (tid: DatoTidMap) => void;
}

const oppdaterDagerIPeriode = (
    normalTimer: number,
    { fom, tom, prosent, tidFasteDager }: ArbeidstidPeriodeData
): DatoTidMap => {
    const datoerIPeriode = getDatesInDateRange({ from: fom, to: tom }, true);
    const dagerSomSkalEndres: DatoTidMap = {};
    const ingenTid: InputTime = { hours: '0', minutes: '0' };
    datoerIPeriode.forEach((dato) => {
        const isoDate = dateToISODate(dato);
        if (prosent !== undefined) {
            const prosentNumber = getNumberFromNumberInputValue(prosent);
            if (prosentNumber === undefined) {
                return;
            }
            if (prosentNumber === 0) {
                dagerSomSkalEndres[isoDate] = { varighet: ingenTid, prosent: prosentNumber };
            } else {
                const isoDurationPerDag = getRedusertArbeidstidSomInputTime(normalTimer / 5, prosentNumber);
                dagerSomSkalEndres[isoDate] = { varighet: isoDurationPerDag, prosent: prosentNumber };
            }
        } else if (tidFasteDager) {
            const varighet = getTidForUkedag(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday()) || ingenTid;
            dagerSomSkalEndres[isoDate] = { varighet };
        }
    });
    return dagerSomSkalEndres;
};

const RegistrerArbeidstidPeriode: React.FunctionComponent<Props> = ({
    intlValues,
    arbeidsstedNavn,
    periode,
    jobberNormaltTimer,
    onPeriodeChange,
}) => {
    const [visPeriode, setVisPeriode] = useState(false);
    const { logArbeidPeriodeRegistrert } = useLogSøknadInfo();
    const erHistorisk = dayjs(periode.to).isBefore(dateToday);

    const handleFormSubmit = (data: ArbeidstidPeriodeData) => {
        setVisPeriode(false);
        setTimeout(() => {
            logArbeidPeriodeRegistrert({
                erHistorisk,
                verdi: data.prosent ? 'prosent' : 'ukeplan',
                prosent: data.prosent,
            });
            onPeriodeChange(oppdaterDagerIPeriode(jobberNormaltTimer, data));
        });
    };

    return (
        <>
            <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true}>
                <FormattedMessage id="registrerArbeidstidPeriode.registrerJobbKnapp.label" />
            </Knapp>
            <ArbeidstidPeriodeDialog
                intlValues={intlValues}
                periode={periode}
                jobberNormaltTimer={jobberNormaltTimer}
                arbeidsstedNavn={arbeidsstedNavn}
                isOpen={visPeriode}
                onCancel={() => setVisPeriode(false)}
                onSubmit={handleFormSubmit}
            />
        </>
    );
};

export default RegistrerArbeidstidPeriode;
