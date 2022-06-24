import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummaryBlock from '@navikt/sif-common-core/lib/components/summary-block/SummaryBlock';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { UtenlandskNæringApi } from '../../../types/søknad-api-data/SøknadApiData';
import { prettifyApiDate } from '@navikt/sif-common-core/lib/components/summary-enkeltsvar/DatoSvar';
import IntlLabelValue from '@navikt/sif-common-forms/lib/components/summary/IntlLabelValue';
interface Props {
    utenlandskNæring: UtenlandskNæringApi[];
}

function UtenlandskNæringSummary({ utenlandskNæring }: Props) {
    const intl = useIntl();
    const renderUtenlandskNæring = (næring: UtenlandskNæringApi): React.ReactNode => {
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
                <div style={{ paddingLeft: '1rem' }}>
                    <IntlLabelValue labelKey="sifForms.utenlandskNæringForm.summary.navn">
                        {næring.navnPåVirksomheten}.
                    </IntlLabelValue>
                    <IntlLabelValue labelKey="sifForms.utenlandskNæringForm.summary.næringstype">
                        {næringstype}.
                    </IntlLabelValue>

                    <div>
                        <FormattedMessage
                            id="sifForms.utenlandskNæringForm.summary.registrertILand"
                            values={{ land }}
                        />
                        <FormattedMessage
                            id="sifForms.utenlandskNæringForm.summary.registrertILand.orgnr"
                            values={{ orgnr: næring.identifikasjonsnummer }}
                        />
                        . <br />
                        {tidsinfo}
                    </div>
                </div>
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
            {utenlandskNæring.length > 0 && <>{utenlandskNæring.map((næring) => renderUtenlandskNæring(næring))}</>}
        </SummaryBlock>
    );
}

export default UtenlandskNæringSummary;
