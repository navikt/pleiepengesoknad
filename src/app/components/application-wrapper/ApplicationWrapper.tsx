import * as React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import IntlProvider from '../intl-provider/IntlProvider';
import { Søkerdata } from '../../types/Søkerdata';
import { Locale } from 'common/types/Locale';
import { Normaltekst } from 'nav-frontend-typografi';
import DemoModeInfo from '../demo-mode-info/DemoModeInfo';
import { appIsRunningInDemoMode } from '../../utils/envUtils';
import LanguageToggle from 'common/components/language-toggle/LanguageToggle';

interface ApplicationWrapperProps {
    søkerdata?: Søkerdata;
    locale: Locale;
    onChangeLocale: (locale: Locale) => void;
}

const demoMode = appIsRunningInDemoMode();
const languageToggleEnabled = false;

const ApplicationWrapper: React.FunctionComponent<ApplicationWrapperProps> = ({ locale, onChangeLocale, children }) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                {demoMode && <DemoModeInfo />}

                {demoMode === false && languageToggleEnabled && (
                    <LanguageToggle locale={locale} toggle={onChangeLocale} />
                )}
                <Router>{children}</Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
