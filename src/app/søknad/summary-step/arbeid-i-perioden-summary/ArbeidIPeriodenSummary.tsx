import React from 'react';
import { IntlShape, useIntl } from 'react-intl';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import { apiStringDateToDate, DateRange, prettifyDateExtended } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dayjs from 'dayjs';
import {
    ArbeidsforholdApiData,
    FrilansApiData,
    isArbeidsgiverISøknadsperiodeApiData,
    SøknadApiData,
} from '../../../types/SøknadApiData';
import { erFrilanserITidsrom } from '../../../utils/frilanserUtils';
import ArbeidIPeriodeSummaryItem from './ArbeidIPeriodenSummaryItem';

interface Props {
    apiValues: SøknadApiData;
    søknadsperiode: DateRange;
    søknadsdato: Date;
}

export interface ArbeidIPeriodenSummaryItemType extends ArbeidsforholdApiData {
    tittel: string;
    erAktivIPeriode: boolean;
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
}) => {
    const intl = useIntl();
    const alleArbeidsforhold: ArbeidIPeriodenSummaryItemType[] = [];

    if (arbeidsgivere) {
        arbeidsgivere.forEach((a) => {
            if (isArbeidsgiverISøknadsperiodeApiData(a)) {
                alleArbeidsforhold.push({
                    ...a.arbeidsforhold,
                    tittel: intlHelper(intl, 'arbeidsgiver.tittel', {
                        navn: a.navn,
                        organisasjonsnummer: a.organisasjonsnummer,
                    }),
                    erAktivIPeriode: true,
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
            erAktivIPeriode: erFrilanserITidsrom(søknadsperiode, frilansStartSlutt),
        });
    }

    if (selvstendigNæringsdrivende?.arbeidsforhold) {
        alleArbeidsforhold.push({
            ...selvstendigNæringsdrivende.arbeidsforhold,
            tittel: intlHelper(intl, 'selvstendigNæringsdrivende.tittel'),
            erAktivIPeriode: true,
        });
    }

    if (alleArbeidsforhold.length === 0) {
        return (
            <SummarySection header={intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeidIkkeRegistrert.header')}>
                {intlHelper(intl, 'oppsummering.arbeidIPeriode.arbeidIkkeRegistrert.info')}
            </SummarySection>
        );
    }

    const aktiveArbeidsforhold = alleArbeidsforhold.filter((a) => a.erAktivIPeriode);

    return (
        <>
            {aktiveArbeidsforhold.length > 0 && (
                <SummarySection header={intlHelper(intl, 'oppsummering.arbeidIPeriode.jobbIPerioden.header')}>
                    {aktiveArbeidsforhold.map((forhold) =>
                        forhold.arbeidIPeriode ? (
                            <SummaryBlock header={forhold.tittel} key={forhold.tittel}>
                                <ArbeidIPeriodeSummaryItem
                                    periode={søknadsperiode}
                                    arbeidIPeriode={forhold.arbeidIPeriode}
                                    normaltimerUke={forhold.jobberNormaltTimer}
                                />
                            </SummaryBlock>
                        ) : (
                            <div>Informasjon om arbeid i perioden mangler</div>
                        )
                    )}
                </SummarySection>
            )}
        </>
    );
};

export default ArbeidIPeriodenSummary;
