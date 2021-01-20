import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import { BarnRelasjon, PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import SummarySection from '../../summary-section/SummarySection';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import Sitat from './Sitat';

interface Props {
    barn: BarnReceivedFromApi[];
    formValues: PleiepengesøknadFormData;
    apiValues: PleiepengesøknadApiData;
}

const apiBarnSummary = (apiBarn: BarnReceivedFromApi) => (
    <>
        <Normaltekst>
            <FormattedMessage
                id="steg.oppsummering.barnet.navn"
                values={{
                    navn: formatName(apiBarn.fornavn, apiBarn.etternavn, apiBarn.mellomnavn),
                }}
            />
        </Normaltekst>
        <Normaltekst>
            <FormattedMessage
                id="steg.oppsummering.barnet.fødselsdato"
                values={{
                    dato: prettifyDate(apiBarn.fødselsdato),
                }}
            />
        </Normaltekst>
    </>
);

const annetBarnSummary = (apiValues: PleiepengesøknadApiData) => (
    <>
        {apiValues.barn.fødselsdato ? (
            <Normaltekst>
                <FormattedMessage
                    id="steg.oppsummering.barnet.fødselsdato"
                    values={{
                        dato: prettifyDate(apiStringDateToDate(apiValues.barn.fødselsdato)),
                    }}
                />
            </Normaltekst>
        ) : null}
        {!apiValues.barn.fødselsdato ? (
            <Normaltekst>
                <FormattedMessage id="steg.oppsummering.barnet.fnr" values={{ fnr: apiValues.barn.fødselsnummer }} />
            </Normaltekst>
        ) : null}
        {apiValues.barn.navn ? (
            <Normaltekst>
                <FormattedMessage id="steg.oppsummering.barnet.navn" values={{ navn: apiValues.barn.navn }} />
            </Normaltekst>
        ) : null}
    </>
);

const RelasjonTilBarnet = (intl: IntlShape, apiValues: PleiepengesøknadApiData) => (
    <SummarySection header={intlHelper(intl, 'steg.oppsummering.relasjonTilBarnet.header')}>
        <Box margin="m">
            {apiValues.barnRelasjon !== BarnRelasjon.ANNET && (
                <Normaltekst>
                    <FormattedMessage
                        id="steg.oppsummering.relasjonTilBarnet"
                        values={{ relasjon: apiValues.barnRelasjon }}
                    />
                </Normaltekst>
            )}
            {apiValues.barnRelasjon === BarnRelasjon.ANNET && (
                <Normaltekst tag="div">
                    <FormattedMessage id="steg.oppsummering.relasjonTilBarnetBeskrivelse" />
                    <Sitat>
                        <TextareaSummary text={apiValues.barnRelasjonBeskrivelse} />
                    </Sitat>
                </Normaltekst>
            )}
        </Box>
    </SummarySection>
);

const BarnSummary = ({ formValues, apiValues, barn }: Props) => {
    const intl = useIntl();
    const apiBarn = barn.find(({ aktørId }) => aktørId === formValues.barnetSøknadenGjelder);
    const useApiBarn = !formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0;

    return (
        <>
            <SummarySection header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
                <Box margin="m">
                    {useApiBarn && apiBarn && apiBarnSummary(apiBarn)}
                    {!useApiBarn && annetBarnSummary(apiValues)}
                </Box>
            </SummarySection>
            {!useApiBarn && RelasjonTilBarnet(intl, apiValues)}
        </>
    );
};

export default BarnSummary;
