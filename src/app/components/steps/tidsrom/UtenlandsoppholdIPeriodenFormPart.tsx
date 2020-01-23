import React from 'react';
import { useIntl } from 'react-intl';
import { Field, FieldProps } from 'formik';
import { AppFormField } from 'app/types/PleiepengesøknadFormData';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { validateUtenlandsoppholdIPerioden } from 'app/validation/fieldValidations';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import ModalFormAndList from 'common/components/modal-form-and-list/ModalFormAndList';
import UtenlandsoppholdListe from 'common/forms/utenlandsopphold/UtenlandsoppholdListe';
import UtenlandsoppholdForm from 'common/forms/utenlandsopphold/UtenlandsoppholdForm';
import { date1YearAgo, date1YearFromNow, DateRange } from 'common/utils/dateUtils';

interface Props {
    periode: DateRange;
}

function UtenlandsoppholdIPeriodenFormPart({ periode }: Props) {
    const intl = useIntl();
    return (
        <Field
            name={AppFormField.utenlandsoppholdIPerioden}
            validate={
                periode
                    ? (opphold: Utenlandsopphold[]) => validateUtenlandsoppholdIPerioden(periode, opphold)
                    : undefined
            }>
            {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <>
                        <ModalFormAndList<Utenlandsopphold>
                            items={field.value}
                            onChange={(oppholdsliste) => {
                                setFieldValue(field.name, oppholdsliste);
                            }}
                            error={errorMsgProps?.feil}
                            labels={{
                                modalTitle: 'Utenlandsopphold',
                                listTitle: 'Registrerte utenlandsopphold i perioden',
                                addLabel: 'Legg til utenlandsopphold'
                            }}
                            listRenderer={(onEdit, onDelete) => (
                                <UtenlandsoppholdListe
                                    utenlandsopphold={field.value}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                />
                            )}
                            formRenderer={(onSubmit, onCancel, opphold) => (
                                <UtenlandsoppholdForm
                                    labels={{}}
                                    opphold={opphold}
                                    onCancel={onCancel}
                                    onSubmit={onSubmit}
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    reasonNeeded={true}
                                    {...errorMsgProps}
                                />
                            )}
                        />
                    </>
                );
            }}
        </Field>
    );
}
export default UtenlandsoppholdIPeriodenFormPart;
