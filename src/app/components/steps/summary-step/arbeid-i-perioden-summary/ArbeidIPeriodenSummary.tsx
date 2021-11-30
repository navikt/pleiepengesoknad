import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import { apiStringDateToDate, DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import {
    ArbeidsforholdApiData,
    FrilansApiData,
    isArbeidsgiverISøknadsperiodeApiData,
    SøknadApiData,
} from '../../../../types/SøknadApiData';
import { erFrilanserITidsrom } from '../../../../utils/frilanserUtils';
import { getHistoriskPeriode, getPlanlagtPeriode } from '../../../../utils/tidsbrukUtils';
import SummaryBlock from '../../../summary-block/SummaryBlock';
import SummarySection from '../../../summary-section/SummarySection';
import ArbeidIPeriodeSummaryItem from './ArbeidIPeriodenSummaryItem';

interface Props {
    apiValues: SøknadApiData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
    varAktivtIHistoriskPeriode: boolean;
    erAktivtIPlanlagtPeriode: boolean;
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
    return intlHelper(intl, 'frilans.tittel');
};

const ArbeidIPeriodenSummary: React.FunctionComponent<Props> = ({
    apiValues: { arbeidsgivere, frilans, selvstendigNæringsdrivende },
    søknadsperiode,
    søknadsdato,
}) => {
    const intl = useIntl();
    const alleArbeidsforhold: ArbeidIPeriodenSummaryItemType[] = [];

    const periodeFørSøknadsdato = søknadsperiode ? getHistoriskPeriode(søknadsperiode, søknadsdato) : undefined;
    const periodeFraOgMedSøknadsdato = søknadsperiode ? getPlanlagtPeriode(søknadsperiode, søknadsdato) : undefined;

    if (arbeidsgivere) {
        arbeidsgivere.forEach((a) => {
            if (isArbeidsgiverISøknadsperiodeApiData(a)) {
                alleArbeidsforhold.push({
                    ...a.arbeidsforhold,
                    tittel: intlHelper(intl, 'arbeidsgiver.tittel', {
                        navn: a.navn,
                        organisasjonsnummer: a.organisasjonsnummer,
                    }),
                    erAktivtIPlanlagtPeriode: true,
                    varAktivtIHistoriskPeriode: true,
                });
            }
        });
    }

    if (frilans?.arbeidsforhold) {
        const frilansStartSlutt = {
            frilansStartdato: apiStringDateToDate(frilans.startdato),
            frilansSluttdato: frilans.sluttdato ? apiStringDateToDate(frilans.sluttdato) : undefined,
        };

        alleArbeidsforhold.push({
            ...frilans.arbeidsforhold,
            tittel: getFrilansTittel(intl, frilans, søknadsperiode),
            varAktivtIHistoriskPeriode: periodeFørSøknadsdato
                ? erFrilanserITidsrom(periodeFørSøknadsdato, frilansStartSlutt)
                : false,
            erAktivtIPlanlagtPeriode: periodeFraOgMedSøknadsdato
                ? erFrilanserITidsrom(periodeFraOgMedSøknadsdato, frilansStartSlutt)
                : false,
        });
    }

    if (selvstendigNæringsdrivende?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...selvstendigNæringsdrivende.arbeidsforhold,
            tittel: intlHelper(intl, 'selvstendigNæringsdrivende.tittel'),
            erAktivtIPlanlagtPeriode: true,
            varAktivtIHistoriskPeriode: true,
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
        return (
            <SummarySection header={intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeidIkkeRegistrert.header')}>
                {intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeidIkkeRegistrert.info')}
            </SummarySection>
        );
    }

    const arbeidsforholdIHistoriskPeriode = alleArbeidsforhold.filter(
        (a) => a.varAktivtIHistoriskPeriode && a.historiskArbeid
    );
    const arbeidsforholdIPlanlagtPeriode = alleArbeidsforhold.filter(
        (a) => a.erAktivtIPlanlagtPeriode && a.planlagtArbeid
    );

    return (
        <>
            {periodeFørSøknadsdato && arbeidsforholdIHistoriskPeriode.length > 0 && (
                <SummarySection header={getSectionHeaderText(periodeFørSøknadsdato, true)}>
                    {arbeidsforholdIHistoriskPeriode.map((forhold) =>
                        forhold.historiskArbeid ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={periodeFørSøknadsdato}
                                    arbeidIPeriode={forhold.historiskArbeid}
                                    normaltimerUke={forhold.jobberNormaltTimer}
                                    erHistorisk={true}
                                />
                            </SummaryBlock>
                        ) : (
                            <div>Historisk arbeid mangler</div>
                        )
                    )}
                </SummarySection>
            )}
            {periodeFraOgMedSøknadsdato && arbeidsforholdIPlanlagtPeriode.length > 0 && (
                <SummarySection header={getSectionHeaderText(periodeFraOgMedSøknadsdato, false)}>
                    {arbeidsforholdIPlanlagtPeriode.map((forhold) =>
                        forhold.planlagtArbeid ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={periodeFraOgMedSøknadsdato}
                                    arbeidIPeriode={forhold.planlagtArbeid}
                                    normaltimerUke={forhold.jobberNormaltTimer}
                                    erHistorisk={false}
                                />
                            </SummaryBlock>
                        ) : (
                            <div>Planlagt arbeid mangler</div>
                        )
                    )}
                </SummarySection>
            )}
        </>
    );
};

export default ArbeidIPeriodenSummary;
