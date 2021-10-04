import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import {
    apiStringDateToDate,
    DateRange,
    dateToday,
    prettifyDateExtended,
} from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import {
    ArbeidsforholdApiData,
    FrilansApiData,
    PleiepengesøknadApiData,
} from '../../../../types/PleiepengesøknadApiData';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../../../utils/tidsbrukUtils';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import SummarySection from '../../../summary-section/SummarySection';
import ArbeidIPeriodeSummaryItem from './ArbeidIPeriodenSummaryItem';
import dayjs from 'dayjs';

interface Props {
    apiValues: PleiepengesøknadApiData;
    søknadsperiode: DateRange;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const getFrilansTittel = (intl: IntlShape, frilans: FrilansApiData, periode: DateRange) => {
    const startdato = frilans.startdato && apiStringDateToDate(frilans.startdato);
    const sluttdato = frilans.sluttdato && apiStringDateToDate(frilans.sluttdato);

    if (startdato || sluttdato) {
        const intlValues = {
            startdato: startdato ? prettifyDateExtended(startdato) : undefined,
            sluttdato: sluttdato ? prettifyDateExtended(sluttdato) : undefined,
        };
        const visStartdato = startdato && dayjs(startdato).isAfter(periode.from, 'day');
        const visSluttdato = sluttdato && dayjs(sluttdato).isBefore(periode.to, 'day');

        if (visStartdato && visSluttdato) {
            return intlHelper(intl, 'frilans.tittel.startOgSlutt', intlValues);
        }
        if (visStartdato) {
            return intlHelper(intl, 'frilans.tittel.start', intlValues);
        }
        if (visSluttdato) {
            return intlHelper(intl, 'frilans.tittel.slutt', intlValues);
        }
    }
    return intlHelper(intl, 'frilans.tittel.header');
};

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
            tittel: getFrilansTittel(intl, frilans, søknadsperiode),
        });
    }

    if (selvstendigNæringsdrivende?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...selvstendigNæringsdrivende.arbeidsforhold,
            tittel: intlHelper(intl, 'selvstendigNæringsdrivende.tittel'),
        });
    }

    const getSectionHeaderText = (periode: DateRange, erHistorisk: boolean) =>
        intlHelper(
            intl,
            erHistorisk
                ? 'oppsummering.arbeidIPeriode.jobbIPerioden.historisk.header'
                : 'oppsummering.arbeidIPeriode.jobbIPerioden.planlagt.header',
            {
                fra: prettifyDateExtended(periode.from),
                til: prettifyDateExtended(periode.to),
            }
        );

    if (alleArbeidsforhold.length === 0) {
        return <SummarySection header={'Arbeid i perioden'}>Ingen arbeidsforhold registrert</SummarySection>;
    }

    return (
        <>
            {periodeFørSøknadsdato && (
                <SummarySection header={getSectionHeaderText(periodeFørSøknadsdato, true)}>
                    {alleArbeidsforhold.map((forhold) =>
                        forhold.historiskArbeid ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={periodeFørSøknadsdato}
                                    arbeidIPeriode={forhold.historiskArbeid}
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
                <SummarySection header={getSectionHeaderText(periodeFraOgMedSøknadsdato, false)}>
                    {alleArbeidsforhold.map((forhold) =>
                        forhold.planlagtArbeid ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={periodeFraOgMedSøknadsdato}
                                    arbeidIPeriode={forhold.planlagtArbeid}
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
