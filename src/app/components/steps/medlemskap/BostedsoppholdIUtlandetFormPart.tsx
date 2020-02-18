import React from 'react';
import { validateUtenlandsoppholdIPerioden } from 'app/validation/fieldValidations';
import { ModalFormAndListLabels } from 'common/components/modal-form-and-list/ModalFormAndList';
import { DateRange } from 'common/utils/dateUtils';
import { BostedUtland } from 'common/forms/bosted-utland/types';
import BostedUtlandListAndDialog from 'common/forms/bosted-utland/BostedUtlandListAndDialog';
import { AppFormField } from '../../../types/PleiepengesøknadFormData';

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
