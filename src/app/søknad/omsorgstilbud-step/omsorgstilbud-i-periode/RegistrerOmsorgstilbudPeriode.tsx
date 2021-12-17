import React, { useState } from 'react';
// import { FormattedMessage } from 'react-intl';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { Knapp } from 'nav-frontend-knapper';
import OmsorgstilbudPeriodeDialog from '../../../pre-common/omsorgstilbud-periode/OmsorgstilbudPeriodeDialog';
import { getDatesInDateRange } from '../../../utils/common/dateRangeUtils';
import { dateToISODate, ISODateToDate } from '../../../utils/common/isoDateUtils';
// import useLogSøknadInfo from '../../../hooks/useLogSøknadInfo';
import { DatoTidMap, TidUkedager } from '../../../types';
import { OmsorgstilbudPeriodeData } from '../../../pre-common/omsorgstilbud-periode/OmsorgstilbudPeriodeForm';

interface Props {
    periode: DateRange;
    onPeriodeChange: (tid: DatoTidMap) => void;
}

const getTidForUkedag = (tid: TidUkedager, ukedag: number): InputTime | undefined => {
    switch (ukedag) {
        case 1:
            return tid.mandag;
        case 2:
            return tid.tirsdag;
        case 3:
            return tid.onsdag;
        case 4:
            return tid.torsdag;
        case 5:
            return tid.fredag;
    }
    return undefined;
};

const oppdaterDagerIPeriode = ({ fom, tom, tidFasteDager }: OmsorgstilbudPeriodeData): DatoTidMap => {
    const datoerIPeriode = getDatesInDateRange({ from: fom, to: tom }, true);
    const dagerSomSkalEndres: DatoTidMap = {};
    const ingenTid: InputTime = { hours: '0', minutes: '0' };
    datoerIPeriode.forEach((dato) => {
        const isoDate = dateToISODate(dato);
        const varighet = getTidForUkedag(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday()) || ingenTid;
        dagerSomSkalEndres[isoDate] = { varighet };
    });
    return dagerSomSkalEndres;
};

const RegistrerOmsorgstilbudPeriode: React.FC<Props> = ({ periode, onPeriodeChange }) => {
    const [visPeriode, setVisPeriode] = useState(false);

    const handleFormSubmit = (data: OmsorgstilbudPeriodeData) => {
        setVisPeriode(false);
        setTimeout(() => {
            onPeriodeChange(oppdaterDagerIPeriode(data));
        });
    };

    return (
        <>
            <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true}>
                {/*<FormattedMessage id="registrerArbeidstidPeriode.registrerJobbKnapp.label" />*/}
                Registrer tid i omsorgstilbud
            </Knapp>
            <OmsorgstilbudPeriodeDialog
                periode={periode}
                isOpen={visPeriode}
                onCancel={() => setVisPeriode(false)}
                onSubmit={handleFormSubmit}
            />
        </>
    );
};

export default RegistrerOmsorgstilbudPeriode;
