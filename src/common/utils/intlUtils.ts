import { IntlShape } from 'react-intl';

const intlHelper = (
    intl: IntlShape,
    id: string,
    value?: Record<string, string | number | boolean | null | undefined | Date>
): string => intl.formatMessage({ id }, value);

export default intlHelper;
