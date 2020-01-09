import FormikCheckboxPanelGroup from '../formik-checkbox-panel-group/FormikCheckboxPanelGroup';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';

export default injectIntl(FormikCheckboxPanelGroup<AppFormField>());
