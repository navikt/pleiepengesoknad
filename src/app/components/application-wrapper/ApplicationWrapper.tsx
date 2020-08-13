import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import LanguageToggle from '@sif-common/core/components/language-toggle/LanguageToggle';
import { Locale } from '@sif-common/core/types/Locale';
import IntlProvider, { appBokmålstekster, appNynorsktekster } from '../intl-provider/IntlProvider';
import ApplicationMessages from '@sif-common/core/dev-utils/intl/application-messages/ApplicationMessages';

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
                <Router>
                    {children}
                    <ApplicationMessages
                        messages={{
                            nb: appBokmålstekster,
                            nn: appNynorsktekster,
                        }}
                        title="Søknad pleiepenger"
                    />
                </Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
