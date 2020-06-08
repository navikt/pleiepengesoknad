import { erAntallDagerOver8Uker, getAntallDager, } from './varighetUtils';

export const erPeriodeOver8Uker = (fom: Date, tom: Date): { erOver8Uker: boolean; antallDager: number } => {
    const antallDager = getAntallDager(fom, tom);
    const søkerOver8Uker = erAntallDagerOver8Uker(antallDager);
    return {
        antallDager,
        erOver8Uker: søkerOver8Uker
    };
};
