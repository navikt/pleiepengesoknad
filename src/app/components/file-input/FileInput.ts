import FormikFileInput from '../formik-file-input/FormikFileInput';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikFileInput<AppFormField>());
