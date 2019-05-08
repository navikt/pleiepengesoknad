import * as React from 'react';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Lenke from 'nav-frontend-lenker';

const DinePlikterContent: React.FunctionComponent = () => (
    <>
        <Systemtittel>Mine plikter</Systemtittel>
        <ul>
            <li>
                <Normaltekst>
                    Jeg forstår at hvis jeg gir uriktige eller holder tilbake opplysninger kan det få konsekvenser for
                    retten min til pleiepenger.
                </Normaltekst>
            </li>
            <li style={{ marginTop: '0.5rem' }}>
                <span>
                    Jeg har lest og forstått det som står på{' '}
                    <Lenke href="https://nav.no/rettOgPlikt" target="_blank">
                        nav.no/rettogplikt.
                    </Lenke>
                </span>
            </li>
        </ul>
    </>
);

export default DinePlikterContent;
