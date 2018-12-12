import { InjectedIntl, MessageValue } from 'react-intl';

export default (intl: InjectedIntl, id: string, value?: { [key: string]: MessageValue }): string =>
    intl.formatMessage({ id }, value);
