import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LanguageToggle from '@navikt/sif-common-core/lib/components/language-toggle/LanguageToggle';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Normaltekst } from 'nav-frontend-typografi';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import IntlProvider from '../intl-provider/IntlProvider';

interface ApplicationWrapperProps {
    locale: Locale;
    children: React.ReactNode;
    publicPath: any;
    onChangeLocale: (locale: Locale) => void;
}

const ApplicationWrapper = ({ locale, onChangeLocale, publicPath, children }: ApplicationWrapperProps) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                {isFeatureEnabled(Feature.NYNORSK) && <LanguageToggle locale={locale} toggle={onChangeLocale} />}
                <BrowserRouter basename={publicPath}>{children}</BrowserRouter>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
