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
import { getDagInfoForPeriode } from '../../../components/tid-uker-input/utils';
import { DatoTidMap, TidUkedager } from '../../../types';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { getRedusertArbeidstidSomInputTime } from '../../../utils/formToApiMaps/tidsbrukApiUtils';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';

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

    const ingenTid: InputTime = { hours: '0', minutes: '0' };

    const handleChangePeriode = ({ fom, tom, prosent, tidFasteDager }: ArbeidstidPeriodeData) => {
        const datoerIPeriode = getDagInfoForPeriode({ from: fom, to: tom });
        const dagerSomSkalEndres: DatoTidMap = {};
        datoerIPeriode.forEach((dag) => {
            const isoDate = dateToISODate(dag.dato);
            if (prosent !== undefined) {
                const prosentNumber = getNumberFromNumberInputValue(prosent);
                if (prosentNumber === undefined || normalTimer === undefined) {
                    return;
                }
                if (prosentNumber === 0) {
                    dagerSomSkalEndres[isoDate] = { tid: ingenTid, prosent: prosentNumber };
                } else {
                    const isoDurationPerDag = getRedusertArbeidstidSomInputTime(normalTimer / 5, prosentNumber);
                    dagerSomSkalEndres[isoDate] = { tid: isoDurationPerDag, prosent: prosentNumber };
                }
            } else if (tidFasteDager) {
                const tid = getTidForUkedag(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
                dagerSomSkalEndres[isoDate] = { tid: tid || ingenTid };
            }
        });
        const newValues = { ...arbeidstidSøknad, ...dagerSomSkalEndres };
        setFieldValue(formFieldName, newValues);
        setVisPeriode(false);
        if (onAfterChange) {
            onAfterChange(newValues);
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
