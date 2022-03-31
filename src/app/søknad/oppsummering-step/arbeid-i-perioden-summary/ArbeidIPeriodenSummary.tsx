import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import { apiStringDateToDate, DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import { ArbeidsgiverType } from '../../../types';
import { ArbeidsforholdApiData, ArbeidsgiverApiData, SøknadApiData } from '../../../types/SøknadApiData';
import ArbeidIPeriodeSummaryItem from './ArbeidIPeriodenSummaryItem';

interface Props {
    apiValues: SøknadApiData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
}

const getTittel = (intl: IntlShape, arbeidsgiver: ArbeidsgiverApiData, periode: DateRange) => {
    switch (arbeidsgiver.type) {
        case ArbeidsgiverType.ORGANISASJON:
            return intlHelper(intl, 'arbeidsgiver.tittel', {
                navn: arbeidsgiver.navn,
                organisasjonsnummer: arbeidsgiver.organisasjonsnummer,
            });
        case ArbeidsgiverType.PRIVATPERSON:
            return arbeidsgiver.navn;
        case ArbeidsgiverType.FRILANSOPPDRAG:
            const startdato = arbeidsgiver.ansattFom && apiStringDateToDate(arbeidsgiver.ansattFom);
            const sluttdato = arbeidsgiver.ansattTom && apiStringDateToDate(arbeidsgiver.ansattTom);

            if (startdato || sluttdato) {
                const intlValues = {
                    hvor: arbeidsgiver.navn,
                    startdato: startdato ? prettifyDateExtended(startdato) : undefined,
                    sluttdato: sluttdato ? prettifyDateExtended(sluttdato) : undefined,
                };
                const visStartdato = startdato; // TODO - skal denne inn igjen? && dayjs(startdato).isAfter(periode.from, 'day');
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
            return intlHelper(intl, 'frilans.tittel');
    }
};

const ArbeidIPeriodenSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende },
    søknadsperiode,
}) => {
    const intl = useIntl();
    const arbeidsforholdIPerioden: ArbeidIPeriodenSummaryItemType[] = [];

    arbeidsgivere.forEach((arbeidsgiverApiData) => {
        if (arbeidsgiverApiData.arbeidsforhold) {
            arbeidsforholdIPerioden.push({
                ...arbeidsgiverApiData.arbeidsforhold,
                tittel: getTittel(intl, arbeidsgiverApiData, søknadsperiode),
            });
        }
    });

    if (frilans.harInntektSomFrilanser && frilans.arbeidsforhold) {
        arbeidsforholdIPerioden.push({
            ...frilans.arbeidsforhold,
            tittel: 'Frilanser',
        });
    }

    if (selvstendigNæringsdrivende.harInntektSomSelvstendig && selvstendigNæringsdrivende.arbeidsforhold) {
        arbeidsforholdIPerioden.push({
            ...selvstendigNæringsdrivende.arbeidsforhold,
            tittel: intlHelper(intl, 'selvstendigNæringsdrivende.tittel'),
        });
    }

    return (
        <>
            {arbeidsforholdIPerioden.length > 0 && (
                <SummarySection header={intlHelper(intl, 'oppsummering.arbeidIPeriode.jobbIPerioden.header')}>
                    {arbeidsforholdIPerioden.map((arbeidsforhold) => (
                        <SummaryBlock header={arbeidsforhold.tittel} key={arbeidsforhold.tittel}>
                            <ArbeidIPeriodeSummaryItem periode={søknadsperiode} arbeidsforhold={arbeidsforhold} />
                        </SummaryBlock>
                    ))}
                </SummarySection>
            )}
        </>
    );
};

export default ArbeidIPeriodenSummary;
