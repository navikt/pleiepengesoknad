import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import getLenker from '../../../lenker';

const getText = (part: string) => <FormattedMessage id={`modal.minePlikter.${part}`} />;

const DinePlikterContent = () => {
    const intl = useIntl();
    return (
        <>
            <Systemtittel>{getText('tittel')}</Systemtittel>
            <ul>
                <li>
                    <Normaltekst>{getText('part1')}</Normaltekst>
                    <ul>
                        <li>{getText('part1a')}</li>
                        <li>{getText('part1b')}</li>
                    </ul>
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
};

export default DinePlikterContent;
