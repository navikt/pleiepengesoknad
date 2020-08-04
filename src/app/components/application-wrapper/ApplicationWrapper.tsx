import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import LanguageToggle from 'common/components/language-toggle/LanguageToggle';
import FullscreenContainer from 'common/dev-utils/fullscreenContainer/FullscreenContainer';
import { Locale } from 'common/types/Locale';
import IntlProvider, { appBokmålstekster, appNynorsktekster } from '../intl-provider/IntlProvider';
import MessagesPreview from 'common/dev-utils/intl/messages-preview/MessagesPreview';

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
                    <Route path="*/dev/tekster">
                        <FullscreenContainer>
                            <MessagesPreview
                                title="Søknad pleiepenger"
                                showMissingTextSummary={false}
                                showExplanation={false}
                                messages={{
                                    nb: appBokmålstekster,
                                    nn: appNynorsktekster,
                                }}
                            />
                        </FullscreenContainer>
                    </Route>
                </Router>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
