import { getTypedFormComponents } from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

const AppForm = getTypedFormComponents<AppFormField, PleiepengesøknadFormData, ValidationError>();

export default AppForm;
