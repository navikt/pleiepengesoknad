import React from 'react';
import { ModalFormAndListLabels } from '@navikt/sif-common-formik';
import BostedUtlandListAndDialog from '@navikt/sif-common-forms/lib/bosted-utland/BostedUtlandListAndDialog';
import { BostedUtland } from '@navikt/sif-common-forms/lib/bosted-utland/types';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateUtenlandsoppholdIPerioden } from '../../../validation/fieldValidations';
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
