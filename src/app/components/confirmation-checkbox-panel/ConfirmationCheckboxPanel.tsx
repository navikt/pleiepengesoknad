import FormikConfirmationCheckboxPanel from '../formik-confirmation-checkbox-panel/FormikConfirmationCheckboxPanel';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikConfirmationCheckboxPanel<AppFormField>());
