import FormikRadioPanelGroup from '../formik-radio-panel-group/FormikRadioPanelGroup';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikRadioPanelGroup<AppFormField>());
