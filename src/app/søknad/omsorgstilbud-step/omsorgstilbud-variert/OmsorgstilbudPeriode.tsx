import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { DateRange } from '@navikt/sif-common-formik/lib';
import { OmsorgstilbudPeriodeDialog } from '@navikt/sif-common-pleiepenger';
import { OmsorgstilbudPeriodeData } from '@navikt/sif-common-pleiepenger/lib/omsorgstilbud-periode/omsorgstilbud-periode-form/OmsorgstilbudPeriodeForm';
import {
    DateDurationMap,
    dateToISODate,
    getDatesInDateRange,
    getDurationForISOWeekday,
    ISODateToDate,
} from '@navikt/sif-common-utils/lib';
import dayjs from 'dayjs';
import { Knapp } from 'nav-frontend-knapper';

interface Props {
    periode: DateRange;
    gjelderFortid: boolean;
    onPeriodeChange: (tid: DateDurationMap) => void;
}

const oppdaterDagerMedOmsorgstilbudIPeriode = ({
    fom,
    tom,
    tidFasteDager,
}: OmsorgstilbudPeriodeData): DateDurationMap => {
    const datoerIPeriode = getDatesInDateRange({ from: fom, to: tom }, true);
    const dagerSomSkalEndres: DateDurationMap = {};
    datoerIPeriode.forEach((dato) => {
        const isoDate = dateToISODate(dato);
        const varighet = getDurationForISOWeekday(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
        if (varighet) {
            dagerSomSkalEndres[isoDate] = { ...varighet };
        }
    });
    return dagerSomSkalEndres;
};

const OmsorgstilbudPeriode: React.FC<Props> = ({ periode, gjelderFortid, onPeriodeChange }) => {
    const [visPeriode, setVisPeriode] = useState(false);

    const handleFormSubmit = (data: OmsorgstilbudPeriodeData) => {
        setVisPeriode(false);
        setTimeout(() => {
            onPeriodeChange(oppdaterDagerMedOmsorgstilbudIPeriode(data));
        });
    };

    return (
        <>
            <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true}>
                <FormattedMessage id="omsorgstilbudPeriode.leggTilTidIOmsorgstilbudLabel" />
            </Knapp>
            <OmsorgstilbudPeriodeDialog
                formProps={{
                    periode,
                    gjelderFortid,
                    onCancel: () => setVisPeriode(false),
                    onSubmit: handleFormSubmit,
                }}
                isOpen={visPeriode}
            />
        </>
    );
};

export default OmsorgstilbudPeriode;
