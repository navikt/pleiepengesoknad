import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsforholdApiData, PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import SummarySection from '../summary-section/SummarySection';

interface Props {
    apiValues: PleiepengesøknadApiData;
}

interface ArbeidsforholdSummaryItem extends ArbeidsforholdApiData {
    tittel: string;
}

const ArbeidIPeriodenSummary: React.FunctionComponent<Props> = ({ apiValues }) => {
    const intl = useIntl();

    const alleArbeidsforhold: ArbeidsforholdSummaryItem[] = [];

    if (apiValues.arbeidsgivere) {
        apiValues.arbeidsgivere.forEach((a) => {
            alleArbeidsforhold.push({
                ...a.arbeidsforhold,
                tittel: intlHelper(intl, 'arbeidsforhold.oppsummering.ansatt', {
                    navn: a.navn,
                    organisasjonsnummer: a.organisasjonsnummer,
                }),
            });
        });
    }

    if (apiValues.frilans?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...apiValues.frilans.arbeidsforhold,
            tittel: intlHelper(intl, 'arbeidsforhold.oppsummering.frilanser'),
        });
    }

    if (apiValues.selvstendigNæringsdrivende?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...apiValues.selvstendigNæringsdrivende.arbeidsforhold,
            tittel: intlHelper(intl, 'arbeidsforhold.oppsummering.selvstendig'),
        });
    }

    return (
        <>
            {/* Arbeidsforhold */}
            <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidssituasjon.header')}>
                {alleArbeidsforhold.length > 0 && (
                    <SummaryList
                        items={alleArbeidsforhold}
                        itemRenderer={(forhold: ArbeidsforholdSummaryItem) => <p>{forhold.tittel}</p>}
                    />
                )}
                {alleArbeidsforhold.length === 0 && (
                    <Box margin="m">
                        <FormattedMessage id="steg.oppsummering.arbeidssituasjon.ingenArbeidsforhold" />
                    </Box>
                )}
            </SummarySection>
        </>
    );
};

export default ArbeidIPeriodenSummary;
