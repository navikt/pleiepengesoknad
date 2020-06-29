import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import LanguageToggle from 'common/components/language-toggle/LanguageToggle';
import { Locale } from 'common/types/Locale';
import IntlProvider from '../intl-provider/IntlProvider';

interface ApplicationWrapperProps {
    locale: Locale;
    children: React.ReactNode;
    onChangeLocale: (locale: Locale) => void;
}
const ApplicationWrapper = ({ locale, onChangeLocale, children }: ApplicationWrapperProps) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                <LanguageToggle locale={locale} toggle={onChangeLocale} />
                <Router>{children}</Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
