import { getTypedFormComponents } from '@navikt/sif-common-formik';
import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

const AppForm = getTypedFormComponents<AppFormField, PleiepengesøknadFormData>();

export default AppForm;
