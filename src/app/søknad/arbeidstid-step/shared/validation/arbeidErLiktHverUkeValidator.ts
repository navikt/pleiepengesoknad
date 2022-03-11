import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';
import { ArbeidIPeriodeIntlValues } from '@navikt/sif-common-pleiepenger/lib';

export const getArbeidErLiktHverUkeValidator = (intlValues: ArbeidIPeriodeIntlValues) => (value: any) => {
    const error = getRequiredFieldValidator()(value);
    return error
        ? {
              key: 'validation.arbeidIPeriode.erLiktHverUke',
              values: intlValues,
              keepKeyUnaltered: true,
          }
        : undefined;
};
