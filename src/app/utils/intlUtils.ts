import { IntlShape } from 'react-intl';
import { PrimitiveType } from 'intl-messageformat';

const intlHelper = (intl: IntlShape, id: string, value?: Record<string, PrimitiveType>): string =>
    intl.formatMessage({ id }, value);

export default intlHelper;
