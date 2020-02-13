import React from 'react';
import { AppFormField } from 'app/types/PleiepengesøknadFormData';
import { useIntl } from 'react-intl';
import { Ferieuttak } from 'common/forms/ferieuttak/types';
import FerieuttakListAndDialog from 'common/forms/ferieuttak/FerieuttakListAndDialog';
import { DateRange } from 'common/utils/dateUtils';
import { validateFerieuttakIPerioden } from 'app/validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    periode: DateRange;
}

function FerieuttakIPeriodenFormPart({ periode }: Props) {
    const intl = useIntl();
    return (
        <FerieuttakListAndDialog<AppFormField>
            name={AppFormField.ferieuttakIPerioden}
            minDate={periode.from}
            maxDate={periode.to}
            validate={periode ? (ferie: Ferieuttak[]) => validateFerieuttakIPerioden(periode, ferie) : undefined}
            labels={{
                modalTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.modalTitle'),
                listTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.listTitle'),
                addLabel: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.addLabel')
            }}
        />
    );
}
export default FerieuttakIPeriodenFormPart;
