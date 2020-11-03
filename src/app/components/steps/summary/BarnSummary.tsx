import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { apiStringDateToDate, prettifyDate } from '@sif-common/core/utils/dateUtils';
import intlHelper from '@sif-common/core/utils/intlUtils';
import { formatName } from '@sif-common/core/utils/personUtils';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';
import SummarySection from '@navikt/sif-common-soknad/lib/soknad-summary/summary-section/SummarySection';

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

const BarnSummary = ({ formValues, apiValues, barn }: Props) => {
    const intl = useIntl();
    const apiBarn = barn.find(({ aktørId }) => aktørId === formValues.barnetSøknadenGjelder);
    const useApiBarn = !formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0;

    return (
        <SummarySection header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
            {useApiBarn && apiBarn && apiBarnSummary(apiBarn)}
            {!useApiBarn && annetBarnSummary(apiValues)}
        </SummarySection>
    );
};

export default BarnSummary;
