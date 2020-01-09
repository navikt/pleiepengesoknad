import FormikCheckbox from '../formik-checkbox/FormikCheckbox';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikCheckbox<AppFormField>());
