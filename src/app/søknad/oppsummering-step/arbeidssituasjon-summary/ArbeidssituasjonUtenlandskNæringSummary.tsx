import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { UtenlandskNæringApiData } from '../../../types/søknad-api-data/SøknadApiData';
import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';

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
                  fraOgMed: prettifyApiDate(næring.fraOgMed),
                  tilOgMed: prettifyApiDate(næring.tilOgMed),
              })
            : intlHelper(intl, 'sifForms.utenlandskNæringForm.summary.tidsinfo.pågående', {
                  fraOgMed: prettifyApiDate(næring.fraOgMed),
              });
        return (
            <Box margin="m" padBottom="l" key={næring.navnPåVirksomheten}>
                <li>
                    <div>
                        {`${intlHelper(intl, 'sifForms.utenlandskNæringForm.summary.navn')}: ${
                            næring.navnPåVirksomheten
                        }.`}
                    </div>
                    <div>
                        {`${intlHelper(intl, 'sifForms.utenlandskNæringForm.summary.næringstype')}: ${næringstype}.`}
                    </div>

                    <div>
                        <FormattedMessage
                            id="sifForms.utenlandskNæringForm.summary.registrertILand"
                            values={{ land }}
                        />
                        {næring.organisasjonsnummer !== undefined && (
                            <>
                                <FormattedMessage
                                    id="sifForms.utenlandskNæringForm.summary.registrertILand.orgnr"
                                    values={{ orgnr: næring.organisasjonsnummer }}
                                />
                            </>
                        )}
                        .
                    </div>
                    <div>{tidsinfo}</div>
                </li>
            </Box>
        );
    };
    return (
        <SummaryBlock
            header={intlHelper(intl, 'oppsummering.arbeidssituasjon.utenlandskNæring.listetittel')}
            headerTag="h3">
            {utenlandskNæring.length === 0 && (
                <>
                    <FormattedMessage id={'oppsummering.arbeidssituasjon.utenlandskNæring.nei'} tagName="p" />
                </>
            )}
            {utenlandskNæring.length > 0 && <ul>{utenlandskNæring.map((næring) => renderUtenlandskNæring(næring))}</ul>}
        </SummaryBlock>
    );
}

export default UtenlandskNæringSummary;
