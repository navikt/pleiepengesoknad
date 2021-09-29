import React from 'react';
import { useIntl } from 'react-intl';
import { DateRange, dateToday, prettifyDateFull } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdApiData, PleiepengesøknadApiData } from '../../../../types/PleiepengesøknadApiData';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../../../utils/tidsbrukUtils';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import SummarySection from '../../../summary-section/SummarySection';
import ArbeidIPeriodeSummaryItem from './ArbeidIPeriodenSummaryItem';

interface Props {
    apiValues: PleiepengesøknadApiData;
    søknadsperiode: DateRange;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
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
                tittel: intlHelper(intl, 'arbeidsgiver.tittel', {
                    navn: a.navn,
                    organisasjonsnummer: a.organisasjonsnummer,
                }),
            });
        });
    }

    if (frilans?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...frilans.arbeidsforhold,
            tittel: intlHelper(intl, 'frilans.tittel'),
        });
    }

    if (selvstendigNæringsdrivende?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...selvstendigNæringsdrivende.arbeidsforhold,
            tittel: intlHelper(intl, 'selvstendigNæringsdrivende.tittel'),
        });
    }

    if (alleArbeidsforhold.length === 0) {
        return <SummarySection header={'Arbeid i perioden'}>Ingen arbeidsforhold registrert</SummarySection>;
    }

    return (
        <>
            {periodeFørSøknadsdato && (
                <SummarySection
                    header={intlHelper(intl, 'oppsummering.arbeidIPeriode.jobbIPerioden.header', {
                        fra: prettifyDateFull(periodeFørSøknadsdato.from),
                        til: prettifyDateFull(periodeFørSøknadsdato.to),
                    })}>
                    {alleArbeidsforhold.map((forhold) =>
                        forhold.historiskArbeid ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={periodeFørSøknadsdato}
                                    arbeid={forhold.historiskArbeid}
                                    arbeidsform={forhold.arbeidsform}
                                    normaltimer={forhold.jobberNormaltTimer}
                                    erHistorisk={true}
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
                                    arbeidsform={forhold.arbeidsform}
                                    normaltimer={forhold.jobberNormaltTimer}
                                    erHistorisk={false}
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
