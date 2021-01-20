import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import './arbeidsgiverUtskrift.less';

interface Props {
    fom: Date;
    tom: Date;
    arbeidsgiver: string;
    søkernavn: string;
}

const bem = bemUtils('arbeidsgiverUtskrift');

const ArbeidsgiverUtskrift = ({ arbeidsgiver, søkernavn, fom, tom }: Props) => (
    <div className={bem.block}>
        <Systemtittel style={{ marginBottom: '1.5rem' }}>
            <FormattedMessage id="page.arbeidsgiverutskrift.tittel" values={{ arbeidsgiver }} />
        </Systemtittel>
        <p>
            <FormattedMessage id="page.arbeidsgiverutskrift.info.1" />
        </p>
        <p>
            <strong>
                <FormattedMessage id="page.arbeidsgiverutskrift.info.2" values={{ søkernavn, arbeidsgiver }} />
            </strong>
        </p>
        <Box margin="l">
            <strong>
                <FormattedMessage id="page.arbeidsgiverutskrift.info.3" />
            </strong>
            <ul>
                <li>
                    <FormattedHtmlMessage
                        id="page.arbeidsgiverutskrift.info.4.html"
                        value={{ fom: prettifyDate(fom), tom: prettifyDate(tom) }}
                    />
                </li>
            </ul>
        </Box>
        <Box margin="xl">
            <AlertStripeInfo className={bem.element('frist')}>
                <p>
                    <FormattedMessage id="page.arbeidsgiverutskrift.info.5" />
                </p>
                <p>
                    <FormattedHtmlMessage id="page.arbeidsgiverutskrift.info.6.html" />
                </p>
                <p>
                    <FormattedMessage id="page.arbeidsgiverutskrift.info.7" />
                </p>
            </AlertStripeInfo>
        </Box>

        <Element style={{ marginTop: '2rem' }}>
            <FormattedMessage id="page.arbeidsgiverutskrift.sender.tittel" />
        </Element>
        <p>
            <FormattedMessage id="page.arbeidsgiverutskrift.sender.info.1" />
        </p>
        <p>
            <FormattedHtmlMessage
                id="page.arbeidsgiverutskrift.sender.info.2.html"
                value={{ søkernavn, fom: prettifyDate(fom), tom: prettifyDate(tom) }}
            />
        </p>
        <p>
            <FormattedMessage id="page.arbeidsgiverutskrift.merInfo.1" />{' '}
            <Lenke href="https://nav.no/inntektsmelding" target="_blank">
                <FormattedMessage id="page.arbeidsgiverutskrift.merInfo.2" />
            </Lenke>
            <FormattedMessage id="page.arbeidsgiverutskrift.merInfo.3" />
        </p>
    </div>
);

export default ArbeidsgiverUtskrift;
