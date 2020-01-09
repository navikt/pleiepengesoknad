import FormikInput from '../formik-input/FormikInput';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikInput<AppFormField>());
