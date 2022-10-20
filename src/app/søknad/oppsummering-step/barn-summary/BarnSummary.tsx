import React from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import Sitat from '@navikt/sif-common-core/lib/components/summary-enkeltsvar//Sitat';
import SummarySection from '@navikt/sif-common-core/lib/components/summary-section/SummarySection';
import TextareaSummary from '@navikt/sif-common-core/lib/components/textarea-summary/TextareaSummary';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common-core/lib/utils/dateUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { formatName } from '@navikt/sif-common-core/lib/utils/personUtils';
import { Normaltekst } from 'nav-frontend-typografi';
import { BarnRelasjon, RegistrerteBarn } from '../../../types';
import { SøknadApiData } from '../../../types/søknad-api-data/SøknadApiData';
import { SøknadFormValues } from '../../../types/SøknadFormValues';

interface Props {
    barn: RegistrerteBarn[];
    formValues: SøknadFormValues;
    apiValues: SøknadApiData;
}

const apiBarnSummary = (apiBarn: RegistrerteBarn) => (
    <>
        <div data-testid="oppsummering-barnets-navn-registert">
            <FormattedMessage
                id="steg.oppsummering.barnet.navn"
                values={{
                    navn: formatName(apiBarn.fornavn, apiBarn.etternavn, apiBarn.mellomnavn),
                }}
            />
        </div>

        <div data-testid="oppsummering-barnets-fødselsdato-registrert">
            <FormattedMessage
                id="steg.oppsummering.barnet.fødselsdato"
                values={{
                    dato: prettifyDate(apiBarn.fødselsdato),
                }}
            />
        </div>
    </>
);

const annetBarnSummary = (intl: IntlShape, apiValues: SøknadApiData) => (
    <>
        {apiValues.barn.fødselsdato ? (
            <Normaltekst tag="div">
                <div data-testid="oppsummering-barnets-fødselsdato">
                    <FormattedMessage
                        id="steg.oppsummering.barnet.fødselsdato"
                        values={{
                            dato: prettifyDate(apiStringDateToDate(apiValues.barn.fødselsdato)),
                        }}
                    />
                </div>
            </Normaltekst>
        ) : null}
        {!apiValues.barn.fødselsdato ? (
            <Normaltekst tag="div">
                <div data-testid="oppsummering-barnets-fødselsnummer">
                    <FormattedMessage
                        id="steg.oppsummering.barnet.fnr"
                        values={{ fnr: apiValues.barn.fødselsnummer }}
                    />
                </div>
            </Normaltekst>
        ) : null}
        {apiValues.barn.navn ? (
            <Normaltekst tag="div">
                <div data-testid="oppsummering-barnets-navn">
                    <FormattedMessage id="steg.oppsummering.barnet.navn" values={{ navn: apiValues.barn.navn }} />
                </div>
            </Normaltekst>
        ) : null}
        {apiValues._barnetHarIkkeFnr && apiValues.barn.årsakManglerIdentitetsnummer && (
            <Box margin="l">
                <Normaltekst tag="div">
                    <div data-testid="oppsummering-årsakManglerIdentitetsnummer">
                        <FormattedMessage
                            id="steg.oppsummering.barnet.barnetHarIkkeFnr"
                            values={{
                                årsak: intlHelper(
                                    intl,
                                    `steg.oppsummering.barnet.årsakManglerIdentitetsnummer.${apiValues.barn.årsakManglerIdentitetsnummer}`
                                ),
                            }}
                        />
                    </div>
                </Normaltekst>
            </Box>
        )}
    </>
);

const RelasjonTilBarnet = (intl: IntlShape, apiValues: SøknadApiData) => (
    <SummarySection header={intlHelper(intl, 'steg.oppsummering.relasjonTilBarnet.header')}>
        <Box margin="m">
            {apiValues.barnRelasjon !== BarnRelasjon.ANNET && (
                <Normaltekst tag="div">
                    <div data-testid="oppsummering-barn-relasjon">
                        <FormattedMessage id={`steg.oppsummering.barnRelasjon.${apiValues.barnRelasjon}`} />
                    </div>
                </Normaltekst>
            )}
            {apiValues.barnRelasjon === BarnRelasjon.ANNET && (
                <Normaltekst tag="div">
                    <FormattedMessage id="steg.oppsummering.relasjonTilBarnetBeskrivelse" />
                    <Sitat>
                        <div data-testid="oppsummering-barn-relasjon-annet-beskrivelse">
                            <TextareaSummary text={apiValues.barnRelasjonBeskrivelse} />
                        </div>
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
                    {!useApiBarn && annetBarnSummary(intl, apiValues)}
                </Box>
            </SummarySection>
            {!useApiBarn && RelasjonTilBarnet(intl, apiValues)}
        </>
    );
};

export default BarnSummary;
