import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { ArbeidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib';

export const getArbeidstidTimerEllerProsentValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    if (error) {
        return {
            key: `validation.arbeidIPeriode.timerEllerProsent.${error}`,
            values: { ...intlValues, min: 1, max: 99 },
            keepKeyUnaltered: true,
        };
    }
    return undefined;
};
