import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
// import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Arbeidsgiver } from '../../../types';
import { FrilansApiData } from '../../../types/søknad-api-data/SøknadApiData';
// import NormalarbeidstidSummary from './NormalarbeidstidSummary';
import { dateFormatter, ISODateToDate } from '@navikt/sif-common-utils/lib';
import { FrilansTyper } from '../../../types/FrilansFormData';

interface Props {
    frilans: FrilansApiData;
    frilansoppdrag: Arbeidsgiver[];
}

const ArbeidssituasjonFrilansSummary = ({ frilans, frilansoppdrag }: Props) => {
    const intl = useIntl();
    if (frilans.harInntektSomFrilanser === false) {
        return (
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
                <ul data-testid="arbeidssituasjon-frilanser">
                    <li>
                        <FormattedMessage id={'oppsummering.arbeidssituasjon.frilans.erIkkeFrilanser'} tagName="p" />
                    </li>
                </ul>
            </SummaryBlock>
        );
    }

    return (
        <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.frilanser.header')} headerTag="h3">
            <ul data-testid="arbeidssituasjon-frilanser">
                {frilans.frilansTyper.map((type) => {
                    return (
                        <li key={type}>
                            <FormattedMessage id={`oppsummering.arbeidssituasjon.frilans.${type}`} />
                            {type === FrilansTyper.STYREVERV && frilans.misterHonorarer === false && (
                                <div>
                                    <FormattedMessage
                                        id={'oppsummering.arbeidssituasjon.frilans.STYREVERV.misterIkkeHonorar'}
                                    />
                                </div>
                            )}
                        </li>
                    );
                })}
                {frilans.type === 'harArbeidsforhold' && frilans.startdato && (
                    <li>
                        <FormattedMessage
                            id="oppsummering.arbeidssituasjon.frilans.startet"
                            values={{ dato: dateFormatter.full(ISODateToDate(frilans.startdato)) }}
                        />
                    </li>
                )}
                {/* Dersom bruker fortsatt er frilanser i perioden (arbeidsforhold finnes), og har frilansoppdrag */}
                {frilans.type === 'harArbeidsforhold' &&
                    frilans.arbeidsforhold &&
                    frilansoppdrag &&
                    frilansoppdrag.length > 0 && (
                        <li>
                            <FormattedMessage id="oppsummering.arbeidssituasjon.frilans.frilansoppdrag" />
                            <br />
                            <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
                                {frilansoppdrag.map((oppdrag) => (
                                    <li key={oppdrag.id}>{oppdrag.navn}</li>
                                ))}
                            </ul>
                        </li>
                    )}
            </ul>
        </SummaryBlock>
    );
};

export default ArbeidssituasjonFrilansSummary;
