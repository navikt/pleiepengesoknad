import FormikDatepicker from '../formik-datepicker/FormikDatepicker';
import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikDatepicker<Field>());
