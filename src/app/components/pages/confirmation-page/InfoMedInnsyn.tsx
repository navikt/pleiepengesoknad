import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { Ingress } from 'nav-frontend-typografi';
import getLenker from '../../../lenker';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';

interface Props {
    numberOfArbeidsforhold: number;
}

const InfoMedInnsyn = ({ numberOfArbeidsforhold }: Props) => {
    const intl = useIntl();
    const lenker = getLenker(intl.locale);
    return (
        <>
            <Ingress>
                <FormattedMessage id="page.confirmation.undertittel" />
            </Ingress>
            <ul className="checklist">
                <li>
                    <FormattedMessage id="page.confirmation.info.1a" />{' '}
                    <FormattedMessage id="page.confirmation.info.1b" />{' '}
                    <Lenke href={lenker.innsynSIF} target="_blank">
                        <FormattedMessage id="page.confirmation.info.1c" />
                    </Lenke>
                    <FormattedMessage id="page.confirmation.info.1d" />
                </li>
                <li>
                    <FormattedMessage id="page.confirmation.info.2a" />{' '}
                    <Lenke href={lenker.saksbehandlingstider} target="_blank">
                        <FormattedMessage id="page.confirmation.info.2b" />
                    </Lenke>
                    <FormattedMessage id="page.confirmation.info.2c" />
                </li>
                <li>
                    <FormattedHtmlMessage id="page.confirmation.info.3a.html" />
                    <p>
                        <FormattedHtmlMessage id="page.confirmation.info.3b.html" />
                    </p>
                </li>
                <li>
                    <FormattedMessage id="page.confirmation.info.4" />
                </li>
                {numberOfArbeidsforhold > 0 && (
                    <li>
                        <FormattedMessage id="page.confirmation.info.5" values={{ numberOfArbeidsforhold }} />
                    </li>
                )}
            </ul>
        </>
    );
};

export default InfoMedInnsyn;
