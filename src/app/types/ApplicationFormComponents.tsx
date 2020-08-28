import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { AppFormField, PleiepengesøknadFormData } from './PleiepengesøknadFormData';

/**
 * Lager typed nav-frontend-skjema komponenter med formik
 * @navikt/sif-common-formik
 */
const ApplicationFormComponents = getTypedFormComponents<AppFormField, PleiepengesøknadFormData>();

export default ApplicationFormComponents;
