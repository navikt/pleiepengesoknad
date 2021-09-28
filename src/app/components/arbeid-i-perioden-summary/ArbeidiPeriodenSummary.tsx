import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { PleiepengesøknadApiData } from '../../types/PleiepengesøknadApiData';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../utils/tidsbrukUtils';
import SummaryBlock from '../steps/summary-step/SummaryBlock';
import SummarySection from '../summary-section/SummarySection';
import ArbeidIPeriodeSummaryItem, { ArbeidIPeriodenSummaryItemType } from './ArbeidIPeriodenSummaryItem';

interface Props {
    apiValues: PleiepengesøknadApiData;
    søknadsperiode: DateRange;
}

const ArbeidIPeriodenSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende },
    søknadsperiode,
}) => {
    const intl = useIntl();
    const alleArbeidsforhold: ArbeidIPeriodenSummaryItemType[] = [];

    const periodeFørSøknadsdato = søknadsperiode ? getHistoriskPeriode(søknadsperiode, dateToday) : undefined;
    const periodeFraOgMedSøknadsdato = søknadsperiode ? getPlanlagtPeriode(søknadsperiode, dateToday) : undefined;

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

    if (alleArbeidsforhold.length === 0) {
        return <SummarySection header={'Arbeid i perioden'}>Ingen arbeidsforhold registrert</SummarySection>;
    }

    return (
        <>
            {periodeFørSøknadsdato && (
                <SummarySection header={'Jobb til nå'}>
                    {alleArbeidsforhold.map((forhold) =>
                        forhold.historiskArbeid ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={periodeFørSøknadsdato}
                                    arbeid={forhold.historiskArbeid}
                                />
                            </SummaryBlock>
                        ) : undefined
                    )}
                </SummarySection>
            )}
            {periodeFraOgMedSøknadsdato && (
                <SummarySection header={'Jobb fremover'}>
                    {alleArbeidsforhold.map((forhold) =>
                        forhold.planlagtArbeid ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={periodeFraOgMedSøknadsdato}
                                    arbeid={forhold.planlagtArbeid}
                                />
                            </SummaryBlock>
                        ) : undefined
                    )}
                </SummarySection>
            )}
        </>
    );
};

export default ArbeidIPeriodenSummary;
