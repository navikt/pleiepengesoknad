import { IntlShape } from 'react-intl';
import { Uttaksdagen } from './Uttaksdagen';

const dagerI8uker = 5 * 8;

export const getAntallDager = (fom: Date, tom: Date): number => {
    return Uttaksdagen(fom).getUttaksdagerFremTilDato(tom);
};

export const erAntallDagerOver8Uker = (antallDager: number): boolean => {
    return antallDager > dagerI8uker;
};

export const getUkerOgDagerFromDager = (dager: number): { uker: number; dager: number } => {
    const uker = Math.floor(dager / 5);
    return {
        dager: dager - uker * 5,
        uker
    };
};

type VarighetFormat = 'full' | 'normal';

export const getVarighetString = (antallDager: number, intl: IntlShape, format: VarighetFormat = 'full'): string => {
    const { uker, dager } = getUkerOgDagerFromDager(Math.abs(antallDager));
    const dagerStr = intl.formatMessage(
        { id: 'common.varighet.dager' },
        {
            dager
        }
    );
    if (uker === 0) {
        return dagerStr;
    }
    const ukerStr = intl.formatMessage({ id: 'common.varighet.uker' }, { uker });
    if (dager > 0) {
        return `${ukerStr}${intl.formatMessage({
            id: `common.varighet.separator--${format}`
        })}${dagerStr}`;
    }
    return ukerStr;
};
