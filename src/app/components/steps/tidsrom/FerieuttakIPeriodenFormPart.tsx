import React from 'react';
import { Field, FieldProps } from 'formik';
import { AppFormField } from 'app/types/PleiepengesøknadFormData';
import { isValidationErrorsVisible } from 'common/formik/formikUtils';
import { getValidationErrorPropsWithIntl } from 'common/utils/navFrontendUtils';
import { useIntl } from 'react-intl';
import ModalFormAndList from 'common/components/modal-form-and-list/ModalFormAndList';
import { Ferieuttak } from 'common/forms/ferieuttak/types';
import FerieuttakListe from 'common/forms/ferieuttak/FerieuttakList';
import FerieuttakForm from 'common/forms/ferieuttak/FerieuttakForm';
import { DateRange } from 'common/utils/dateUtils';
import { validateFerieuttakIPerioden } from 'app/validation/fieldValidations';
import intlHelper from 'common/utils/intlUtils';

interface Props {
    periode: DateRange;
}

function FerieuttakIPeriodenFormPart({ periode }: Props) {
    const intl = useIntl();
    return (
        <Field
            name={AppFormField.ferieuttakIPerioden}
            validate={periode ? (ferie: Ferieuttak[]) => validateFerieuttakIPerioden(periode, ferie) : undefined}>
            {({ field, form: { errors, setFieldValue, status, submitCount } }: FieldProps) => {
                const errorMsgProps = isValidationErrorsVisible(status, submitCount)
                    ? getValidationErrorPropsWithIntl(intl, errors, field.name)
                    : {};
                return (
                    <ModalFormAndList<Ferieuttak>
                        items={field.value}
                        onChange={(ferieuttak) => {
                            setFieldValue(field.name, ferieuttak);
                        }}
                        error={errorMsgProps?.feil}
                        labels={{
                            modalTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.modalTitle'),
                            listTitle: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.listTitle'),
                            addLabel: intlHelper(intl, 'steg.tidsrom.ferieuttakIPerioden.addLabel')
                        }}
                        listRenderer={(onEdit, onDelete) => (
                            <FerieuttakListe ferieuttak={field.value} onDelete={onDelete} onEdit={onEdit} />
                        )}
                        formRenderer={(onSubmit, onCancel, ferieuttak) => (
                            <FerieuttakForm
                                ferieuttak={ferieuttak}
                                onCancel={onCancel}
                                onSubmit={onSubmit}
                                minDate={periode.from}
                                maxDate={periode.to}
                                {...errorMsgProps}
                            />
                        )}
                    />
                );
            }}
        </Field>
    );
}
export default FerieuttakIPeriodenFormPart;
