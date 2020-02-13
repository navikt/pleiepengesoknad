import React from 'react';
import { useIntl } from 'react-intl';
import { AppFormField } from 'app/types/PleiepengesøknadFormData';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { validateUtenlandsoppholdIPerioden } from 'app/validation/fieldValidations';
import UtenlandsoppholdListAndDialog from 'common/forms/utenlandsopphold/UtenlandsoppholdListAndDialog';
import { DateRange } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    periode: DateRange;
}

function UtenlandsoppholdIPeriodenFormPart({ periode }: Props) {
    const intl = useIntl();
    return (
        <UtenlandsoppholdListAndDialog<AppFormField>
            name={AppFormField.utenlandsoppholdIPerioden}
            minDate={periode.from}
            maxDate={periode.to}
            validate={
                periode
                    ? (opphold: Utenlandsopphold[]) => validateUtenlandsoppholdIPerioden(periode, opphold)
                    : undefined
            }
            labels={{
                modalTitle: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.modalTitle'),
                listTitle: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.listTitle'),
                addLabel: intlHelper(intl, 'steg.tidsrom.iUtlandetIPerioden.addLabel')
            }}
        />
    );
}
export default UtenlandsoppholdIPeriodenFormPart;
