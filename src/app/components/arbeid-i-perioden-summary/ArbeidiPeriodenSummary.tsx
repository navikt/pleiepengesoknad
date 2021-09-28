import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummaryList from '@navikt/sif-common-core/lib/components/summary-list/SummaryList';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import SummarySection from '../summary-section/SummarySection';
import ArbeidIPeriodenSummaryItem, { ArbeidIPeriodenSummaryItemType } from './ArbeidIPeriodenSummaryItem';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    apiValues: PleiepengesøknadApiData;
    søknadsperiode: DateRange;
}

const ArbeidIPeriodenSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende },
}) => {
    const intl = useIntl();
    const alleArbeidsforhold: ArbeidIPeriodenSummaryItemType[] = [];

    if (arbeidsgivere) {
        arbeidsgivere.forEach((a) => {
            alleArbeidsforhold.push({
                ...a.arbeidsforhold,
                tittel: intlHelper(intl, 'arbeidsforhold.oppsummering.ansatt', {
                    navn: a.navn,
                    organisasjonsnummer: a.organisasjonsnummer,
                }),
            });
        });
    }

    if (frilans?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...frilans.arbeidsforhold,
            tittel: intlHelper(intl, 'arbeidsforhold.oppsummering.frilanser'),
        });
    }

    if (selvstendigNæringsdrivende?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...selvstendigNæringsdrivende.arbeidsforhold,
            tittel: intlHelper(intl, 'arbeidsforhold.oppsummering.selvstendig'),
        });
    }

    return (
        <>
            <SummarySection header={intlHelper(intl, 'steg.oppsummering.arbeidIPerioden.header')}>
                {alleArbeidsforhold.length > 0 && (
                    <SummaryList
                        items={alleArbeidsforhold}
                        itemRenderer={(item) => <ArbeidIPeriodenSummaryItem item={item} />}
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
