import { InputTime } from '@navikt/sif-common-formik/lib';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import { ValidationError, ValidationResult } from '@navikt/sif-common-formik/lib/validation/types';
import { NumberDuration } from '@navikt/sif-common-utils/lib';

export const getTidEnkeltdagFormTidValidator =
    (maksTid: NumberDuration, minTid: NumberDuration = { hours: 0, minutes: 0 }) =>
    (time: InputTime): ValidationResult<ValidationError> => {
        const error = getTimeValidator({ required: true, max: maksTid, min: minTid })(time);
        if (error) {
            return {
                key: `tidEnkeltdagForm.validation.tid.${error}`,
                keepKeyUnaltered: true,
                values: {
                    maksTimer: maksTid.hours,
                    maksMinutter: maksTid.minutes,
                    minTimer: minTid.hours,
                    minMinutter: minTid.minutes,
                },
            };
        }
        return undefined;
    };
