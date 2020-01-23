import React from 'react';
import { useIntl } from 'react-intl';
import { Field, FieldProps } from 'formik';
import { Utenlandsopphold } from 'common/forms/utenlandsopphold/types';
import { validateUtenlandsoppholdIPerioden } from 'app/validation/fieldValidations';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import ModalFormAndList, { ModalFormAndListLabels } from 'common/components/modal-form-and-list/ModalFormAndList';
import UtenlandsoppholdListe from 'common/forms/utenlandsopphold/UtenlandsoppholdListe';
import UtenlandsoppholdForm from 'common/forms/utenlandsopphold/UtenlandsoppholdForm';
import { DateRange } from 'common/utils/dateUtils';

interface Props<T> {
    periode: DateRange;
    name: T;
    labels: ModalFormAndListLabels;
}

function BostedsoppholdIUtlandetFormPart<T>({ periode, name, labels }: Props<T>) {
    const intl = useIntl();
    return (
        <Field
            name={name}
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
                            error={errorMsgProps?.feil}
                            onChange={(oppholdsliste) => {
                                setFieldValue(field.name, oppholdsliste);
                            }}
                            labels={labels}
                            listRenderer={(onEdit, onDelete) => (
                                <UtenlandsoppholdListe
                                    utenlandsopphold={field.value}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                />
                            )}
                            formRenderer={(onSubmit, onCancel, opphold) => (
                                <UtenlandsoppholdForm
                                    opphold={opphold}
                                    onCancel={onCancel}
                                    onSubmit={onSubmit}
                                    minDate={periode.from}
                                    maxDate={periode.to}
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
export default BostedsoppholdIUtlandetFormPart;
