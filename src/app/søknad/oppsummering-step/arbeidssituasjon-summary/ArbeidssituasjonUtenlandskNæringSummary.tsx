import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Block from '@navikt/sif-common-core-ds/lib/atoms/block/Block';
import intlHelper from '@navikt/sif-common-core-ds/lib/utils/intlUtils';
import SummaryBlock from '@navikt/sif-common-soknad-ds/lib/components/summary-block/SummaryBlock';
import { ISODateToDate, prettifyDate } from '@navikt/sif-common-utils/lib';
import { UtenlandskNæringApiData } from '../../../types/søknad-api-data/SøknadApiData';

interface Props {
    utenlandskNæring: UtenlandskNæringApiData[];
}

function UtenlandskNæringSummary({ utenlandskNæring }: Props) {
    const intl = useIntl();
    const renderUtenlandskNæring = (næring: UtenlandskNæringApiData): React.ReactNode => {
        const land = næring.land.landnavn;

        const næringstype = intlHelper(intl, `sifForms.utenlandskNæringForm.næringstype_${næring.næringstype}`);

        const tidsinfo = næring.tilOgMed
            ? intlHelper(intl, 'sifForms.utenlandskNæringForm.summary.tidsinfo.avsluttet', {
                  fraOgMed: prettifyDate(ISODateToDate(næring.fraOgMed)),
                  tilOgMed: prettifyDate(ISODateToDate(næring.tilOgMed)),
              })
            : intlHelper(intl, 'sifForms.utenlandskNæringForm.summary.tidsinfo.pågående', {
                  fraOgMed: prettifyDate(ISODateToDate(næring.fraOgMed)),
              });
        return (
            <Block margin="m" padBottom="l" key={næring.navnPåVirksomheten}>
                <li>
                    <div data-testid="oppsummering-utenlandskNæring-navn">
                        {`${intlHelper(intl, 'sifForms.utenlandskNæringForm.summary.navn')}: ${
                            næring.navnPåVirksomheten
                        }.`}
                    </div>
                    <div data-testid="oppsummering-utenlandskNæring-næringstype">
                        {`${intlHelper(intl, 'sifForms.utenlandskNæringForm.summary.næringstype')}: ${næringstype}.`}
                    </div>

                    <div data-testid="oppsummering-utenlandskNæring-registrertILand">
                        <FormattedMessage
                            id="sifForms.utenlandskNæringForm.summary.registrertILand"
                            values={{ land }}
                        />
                        {næring.organisasjonsnummer !== undefined && (
                            <FormattedMessage
                                id="sifForms.utenlandskNæringForm.summary.registrertILand.orgnr"
                                values={{ orgnr: næring.organisasjonsnummer }}
                            />
                        )}
                        .
                    </div>
                    <div data-testid="oppsummering-utenlandskNæring-tidsinfo">{tidsinfo}</div>
                </li>
            </Block>
        );
    };
    return (
        <div data-testid="arbeidssituasjon-utenlandskNæring">
            <SummaryBlock header={intlHelper(intl, 'oppsummering.arbeidssituasjon.utenlandskNæring.listetittel')}>
                {utenlandskNæring.length === 0 && (
                    <p data-testid={'arbeidssituasjon-harUtenlandskNæringSvar'}>
                        {intlHelper(intl, 'oppsummering.arbeidssituasjon.utenlandskNæring.nei')}
                    </p>
                )}
                {utenlandskNæring.length > 0 && (
                    <ul>{utenlandskNæring.map((næring) => renderUtenlandskNæring(næring))}</ul>
                )}
            </SummaryBlock>
        </div>
    );
}

export default UtenlandskNæringSummary;
