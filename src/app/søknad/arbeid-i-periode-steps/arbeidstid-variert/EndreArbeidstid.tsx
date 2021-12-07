import React, { useState } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import { DateRange, getNumberFromNumberInputValue, InputTime } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import ArbeidstidPeriodeDialog from '../../../pre-common/arbeidstid-periode/ArbeidstidPeriodeDialog';
import { ArbeidstidPeriodeData } from '../../../pre-common/arbeidstid-periode/ArbeidstidPeriodeForm';
import { dateToISODate, ISODateToDate } from '../../../utils/common/isoDateUtils';
import { DatoTidMap, TidUkedager } from '../../../types';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { getRedusertArbeidstidSomInputTime } from '../../../utils/formToApiMaps/tidsbrukApiUtils';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';
import { getDatesInDateRange } from '../../../utils/common/dateRangeUtils';

interface Props {
    formFieldName: SøknadFormField;
    intlValues: ArbeidIPeriodeIntlValues;
    jobberNormaltTimer: string;
    arbeidsstedNavn: string;
    arbeidstidSøknad: DatoTidMap;
    periode: DateRange;
    onAfterChange?: (tid: DatoTidMap) => void;
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

const oppdaterDagerIPeriode = (normalTimer: number, { fom, tom, prosent, tidFasteDager }: ArbeidstidPeriodeData) => {
    const datoerIPeriode = getDatesInDateRange({ from: fom, to: tom });
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

const EndreArbeidstid: React.FunctionComponent<Props> = ({
    intlValues,
    arbeidstidSøknad,
    formFieldName,
    arbeidsstedNavn,
    periode,
    jobberNormaltTimer,
    onAfterChange,
}) => {
    const [visPeriode, setVisPeriode] = useState(false);
    const { setFieldValue } = useFormikContext<SøknadFormData>();
    const normalTimer = getNumberFromNumberInputValue(jobberNormaltTimer);

    const handleChangePeriode = (data: ArbeidstidPeriodeData) => {
        if (normalTimer === undefined) {
            throw new Error('EndreArbeidstid - normaltimer is undefined');
        }
        const dagerMedArbeid = { ...arbeidstidSøknad, ...oppdaterDagerIPeriode(normalTimer, data) };
        setFieldValue(formFieldName, dagerMedArbeid);
        setVisPeriode(false);
        if (onAfterChange) {
            onAfterChange(dagerMedArbeid);
        }
    };

    return (
        <>
            <p style={{ marginTop: 0 }}>
                Du kan registrere jobb for flere perioder eller for enkeltdager. Enkeltdager registrerer du i listen
                over måneder nedenfor.
                {/* Hvis du skal jobbe over en periode, kan du registrere perioden med jobb som
                prosent eller antall timer du skal jobbe likt hver uke. Hvis du bare skal jobbe noen timer noen
                enkeltdager, registrerer du timene i listen over måneder nedenfor. */}
            </p>
            {/* <p> For å registrere jobb over en periode, trykker du på knappen under:</p> */}
            <Knapperad align="left">
                <Box margin="none" padBottom="l">
                    <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true} type="standard">
                        Registrer jobb i periode
                    </Knapp>
                </Box>
            </Knapperad>
            <ArbeidstidPeriodeDialog
                intlValues={intlValues}
                periode={periode}
                jobberNormaltTimer={jobberNormaltTimer}
                arbeidsstedNavn={arbeidsstedNavn}
                isOpen={visPeriode}
                onCancel={() => setVisPeriode(false)}
                onSubmit={handleChangePeriode}
            />
        </>
    );
};

export default EndreArbeidstid;
