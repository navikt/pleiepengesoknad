import { IntlShape } from 'react-intl';
import { getNumberFromNumberInputValue } from '@navikt/sif-common-formik/lib';
import { decimalDurationToDuration, Duration } from '@navikt/sif-common-utils/lib';
import { getArbeidstidPeriodeIntl } from '../i18n/arbeidstidPeriodeMessages';
import { formatTimerOgMinutter } from '@navikt/sif-common-pleiepenger/lib';

const getRedusertArbeidstidPerDagIUke = (
    jobberNormaltTimer: string | number | undefined,
    skalJobbeProsent: string | undefined
): { normalTimer: number; varighet: Duration } | undefined => {
    const normalTimer =
        typeof jobberNormaltTimer === 'number' ? jobberNormaltTimer : getNumberFromNumberInputValue(jobberNormaltTimer);
    const prosent = getNumberFromNumberInputValue(skalJobbeProsent);
    if (normalTimer !== undefined && prosent !== undefined) {
        const redusertArbeidstidPerDag = (normalTimer / 5 / 100) * prosent;
        return {
            normalTimer,
            varighet: decimalDurationToDuration(redusertArbeidstidPerDag),
        };
    }
    return undefined;
};

export const getRedusertArbeidstidPerUkeInfo = (
    intl: IntlShape,
    jobberNormaltTimerPerUke: string | number | undefined,
    skalJobbeProsent: string | undefined
): string => {
    const arbIntl = getArbeidstidPeriodeIntl(intl);
    const redusertArbeidstidPerDagIUke = getRedusertArbeidstidPerDagIUke(jobberNormaltTimerPerUke, skalJobbeProsent);
    if (redusertArbeidstidPerDagIUke) {
        const timerNormalt = formatTimerOgMinutter(
            intl,
            decimalDurationToDuration(redusertArbeidstidPerDagIUke.normalTimer)
        );
        const timerRedusert = formatTimerOgMinutter(intl, {
            hours: `${redusertArbeidstidPerDagIUke.varighet.hours}` || '',
            minutes: `${redusertArbeidstidPerDagIUke.varighet.minutes}`,
        });
        return arbIntl.intlText('arbeidstidPeriode.redusertArbeidstidPerUke', { timerNormalt, timerRedusert });
    }
    return '';
};
