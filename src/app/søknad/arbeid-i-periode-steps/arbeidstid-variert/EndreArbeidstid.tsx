import React, { useState } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Knapperad from '@navikt/sif-common-core/lib/components/knapperad/Knapperad';
import { DateRange, getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { useFormikContext } from 'formik';
import { Knapp } from 'nav-frontend-knapper';
import { DatoTidMap } from '../../../types';
import { SøknadFormData, SøknadFormField } from '../../../types/SøknadFormData';
import { ArbeidstidPeriodeData } from '../../../pre-common/arbeidstid-periode/ArbeidstidPeriodeForm';
import ArbeidstidPeriodeDialog from '../../../pre-common/arbeidstid-periode/ArbeidstidPeriodeDialog';
import { ArbeidIPeriodeIntlValues } from '../ArbeidIPeriodeSpørsmål';
import { getDagInfoForPeriode } from '../../../components/tid-uker-input/utils';
import { getRedusertArbeidstidSomInputTime } from '../../../utils/formToApiMaps/tidsbrukApiUtils';
import { dateToISODate } from '../../../utils/dateUtils';

interface Props {
    formFieldName: SøknadFormField;
    intlValues: ArbeidIPeriodeIntlValues;
    jobberNormaltTimer: string;
    arbeidsstedNavn: string;
    arbeidstidSøknad: DatoTidMap;
    periode: DateRange;
    onAfterChange?: (tid: DatoTidMap) => void;
}

/** Returns ISODate array */
// export const getDagerDetErSøktForIPeriode = (periode: DateRange, dagerSøktForMap: DagerSøktForMap): ISODate[] => {
//     const dagerIPeriode = getDatoerIPeriode(periode);
//     const dagerIPeriodeDetErSøktFor: ISODate[] = [];
//     dagerIPeriode.forEach((dag) => {
//         if (dagerSøktForMap[dag.isoDateString] === true) {
//             dagerIPeriodeDetErSøktFor.push(dag.isoDateString);
//         }
//     });
//     return dagerIPeriodeDetErSøktFor;
// };

// const getTidForUkedag = (tid: TidFasteDager, ukedag: number): InputTime | undefined => {
//     switch (ukedag) {
//         case 1:
//             return tid.mandag;
//         case 2:
//             return tid.tirsdag;
//         case 3:
//             return tid.onsdag;
//         case 4:
//             return tid.torsdag;
//         case 5:
//             return tid.fredag;
//     }
//     return undefined;
// };

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

    const handleChangePeriode = ({ fom, tom, prosent }: ArbeidstidPeriodeData) => {
        const datoerIPeriode = getDagInfoForPeriode({ from: fom, to: tom });
        const dagerSomSkalEndres: DatoTidMap = {};
        datoerIPeriode.forEach((dag) => {
            const isoDate = dateToISODate(dag.dato);
            if (prosent !== undefined) {
                const prosentNumber = getNumberFromNumberInputValue(prosent);
                if (prosentNumber !== undefined && normalTimer !== undefined) {
                    const isoDurationPerDag = getRedusertArbeidstidSomInputTime(normalTimer / 5, prosentNumber);
                    dagerSomSkalEndres[isoDate] = { tid: isoDurationPerDag, prosent: prosentNumber };
                }
            }
            // if (skalJobbe === false) {
            //     dagerSomSkalEndres[isoDate] = { hours: '0', minutes: '0' };
            // } else if (skalJobbe === true && tidFasteDager) {
            //     const tid = getTidForUkedag(tidFasteDager, dayjs(ISODateToDate(isoDate)).isoWeekday());
            //     if (tid) {
            //         dagerSomSkalEndres[isoDate] = tid;
            //     }
            // }
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
            <Knapperad align="left">
                <Box margin="none" padBottom="l">
                    <Knapp htmlType="button" onClick={() => setVisPeriode(true)} mini={true}>
                        Legg til periode med arbeid
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
