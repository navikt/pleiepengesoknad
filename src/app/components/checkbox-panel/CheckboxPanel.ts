import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikCheckboxPanel from '../formik-checkbox-panel/FormikCheckboxPanel';

export default injectIntl(FormikCheckboxPanel<AppFormField>());
