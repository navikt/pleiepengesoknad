import FormikSlider from '../formik-slider/FormikSlider';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikSlider<AppFormField>());
