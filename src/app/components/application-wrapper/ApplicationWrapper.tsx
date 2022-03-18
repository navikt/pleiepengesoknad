import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Normaltekst } from 'nav-frontend-typografi';
import LanguageToggle from '@navikt/sif-common-core/lib/components/language-toggle/LanguageToggle';
import ApplicationMessages from '@navikt/sif-common-core/lib/dev-utils/intl/application-messages/ApplicationMessages';
import { Locale } from '@navikt/sif-common-core/lib/types/Locale';
import { Feature, isFeatureEnabled } from '../../utils/featureToggleUtils';
import IntlProvider, { appBokmålstekster } from '../intl-provider/IntlProvider';

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
                <BrowserRouter basename={publicPath}>
                    {children}
                    <ApplicationMessages
                        messages={{
                            nb: appBokmålstekster,
                        }}
                        title="Søknad pleiepenger"
                    />
                </BrowserRouter>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
