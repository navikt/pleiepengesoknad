import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Locale } from '@navikt/sif-common-core-ds/lib/types/Locale';
import { Normaltekst } from 'nav-frontend-typografi';
import IntlProvider from '../intl-provider/IntlProvider';

interface ApplicationWrapperProps {
    locale: Locale;
    children: React.ReactNode;
    publicPath: any;
    onChangeLocale: (locale: Locale) => void;
}

const ApplicationWrapper = ({ locale, publicPath, children }: ApplicationWrapperProps) => {
    return (
        <IntlProvider locale={locale}>
            <Normaltekst tag="div">
                <BrowserRouter basename={publicPath}>{children}</BrowserRouter>
            </Normaltekst>
        </IntlProvider>
    );
};

export default ApplicationWrapper;
