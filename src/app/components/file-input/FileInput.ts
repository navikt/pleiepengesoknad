import FormikFileInput from '../formik-file-input/FormikFileInput';
import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikFileInput<Field>());
