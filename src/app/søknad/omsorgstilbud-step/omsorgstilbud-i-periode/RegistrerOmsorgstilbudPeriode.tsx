import React, { useState } from 'react';
import { DateRange, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { Knapp } from 'nav-frontend-knapper';
import OmsorgstilbudPeriodeDialog from '../../../pre-common/omsorgstilbud-periode/OmsorgstilbudPeriodeDialog';
import { getDatesInDateRange } from '../../../utils/common/dateRangeUtils';
import { dateToISODate, ISODateToDate } from '../../../utils/common/isoDateUtils';
import { DatoTidMap } from '../../../types';
import { OmsorgstilbudPeriodeData } from '../../../pre-common/omsorgstilbud-periode/OmsorgstilbudPeriodeForm';
import { FormattedMessage } from 'react-intl';
import { getTidForUkedag } from '../../../utils/datoTidUtils';

interface Props {
    periode: DateRange;
    gjelderFortid: boolean;
    onPeriodeChange: (tid: DatoTidMap) => void;
}

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

const RegistrerOmsorgstilbudPeriode: React.FC<Props> = ({ periode, gjelderFortid, onPeriodeChange }) => {
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
                <FormattedMessage id="omsorgstilbudPeriodeDialog.contentLabel" />
            </Knapp>
            <OmsorgstilbudPeriodeDialog
                periode={periode}
                gjelderFortid={gjelderFortid}
                isOpen={visPeriode}
                onCancel={() => setVisPeriode(false)}
                onSubmit={handleFormSubmit}
            />
        </>
    );
};

export default RegistrerOmsorgstilbudPeriode;
