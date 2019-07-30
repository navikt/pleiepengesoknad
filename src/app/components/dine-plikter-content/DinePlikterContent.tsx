import * as React from 'react';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import getLenker from 'app/lenker';

const getText = (part: string) => <FormattedMessage id={`modal.minePlikter.${part}`} />;

const DinePlikterContent: React.FunctionComponent<InjectedIntlProps> = ({ intl }) => (
    <>
        <Systemtittel>{getText('tittel')}</Systemtittel>
        <ul>
            <li>
                <Normaltekst>{getText('part1')}</Normaltekst>
            </li>
            <li style={{ marginTop: '0.5rem' }}>
                <span>
                    {getText('part2a')}{' '}
                    <Lenke href={getLenker(intl.locale).rettOgPlikt} target="_blank">
                        {getText('part2b')}
                    </Lenke>
                    .
                </span>
            </li>
        </ul>
    </>
);

export default injectIntl(DinePlikterContent);
