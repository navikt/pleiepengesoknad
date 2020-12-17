import React from 'react';
import { ModalFormAndListLabels } from '@sif-common/formik/';
import BostedUtlandListAndDialog from '@sif-common/forms/bosted-utland/BostedUtlandListAndDialog';
import { BostedUtland } from '@sif-common/forms/bosted-utland/types';
import { DateRange } from '@sif-common/core/utils/dateUtils';
import { validateUtenlandsoppholdIPerioden } from 'app/validation/fieldValidations';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';

interface Props {
    periode: DateRange;
    name: AppFormField;
    labels: ModalFormAndListLabels;
}

function BostedsoppholdIUtlandetFormPart({ periode, name, labels }: Props) {
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
