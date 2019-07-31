import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import IntlProvider from '../intl-provider/IntlProvider';
import { Søkerdata } from '../../types/Søkerdata';
import LanguageToggle from '../language-toggle/LanguageToggle';
import { Locale } from 'app/types/Locale';
import { isFeatureEnabled, Feature } from 'app/utils/featureToggleUtils';

interface ApplicationWrapperProps {
    søkerdata?: Søkerdata;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({ locale, onChangeLocale, children }) => {
    return (
        <IntlProvider locale={locale}>
            <div>
                {isFeatureEnabled(Feature.TOGGLE_LANGUAGE) && (
                    <LanguageToggle locale={locale} toggle={onChangeLocale} />
                )}
                <Router>{children}</Router>
            </div>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
