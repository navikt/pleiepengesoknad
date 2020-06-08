import React from 'react';
import { ModalFormAndListLabels, } from '@navikt/sif-common-formik/lib';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { BostedUtland, } from 'common/forms/bosted-utland/types';
import { DateRange, } from 'common/utils/dateUtils';
import { validateUtenlandsoppholdIPerioden, } from 'app/validation/fieldValidations';
import { AppFormField, } from '../../../types/PleiepengesøknadFormData';

interface Props {
    periode: DateRange;
    name: AppFormField;
    labels: ModalFormAndListLabels;
}

function BostedsoppholdIUtlandetFormPart<T>({ periode, name, labels }: Props) {
    return (
        <BostedUtlandListAndDialog<AppFormField>
            name={name}
            minDate={periode.from}
            maxDate={periode.to}
            labels={labels}
            validate={(opphold: BostedUtland[]) => validateUtenlandsoppholdIPerioden(periode, opphold)}
        />
    );
}
export default BostedsoppholdIUtlandetFormPart;
