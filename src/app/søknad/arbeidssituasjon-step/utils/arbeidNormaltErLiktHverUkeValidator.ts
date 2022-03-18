import { getRequiredFieldValidator } from '@navikt/sif-common-formik/lib/validation';

export const getArbeidNormaltErLiktHverUkeValidator =
    (intlValues: { hvor: string; jobber: string }) => (value: any) => {
        const error = getRequiredFieldValidator()(value);
        return error
            ? {
                  key: 'validation.arbeidNormalt.erLiktHverUke',
                  values: intlValues,
                  keepKeyUnaltered: true,
              }
            : undefined;
    };
