import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikTextarea from '../formik-textarea/FormikTextarea';

export default injectIntl(FormikTextarea<AppFormField>());
