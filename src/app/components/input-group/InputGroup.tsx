import { Field } from '../../types/PleiepengesøknadFormData';
import { injectIntl } from 'react-intl';
import FormikInputGroup from './FormikInputGroup';

export default injectIntl(FormikInputGroup<Field>());
