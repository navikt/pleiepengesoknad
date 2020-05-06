import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import ContentWithHeader from 'common/components/content-with-header/ContentWithHeader';
import { apiStringDateToDate, prettifyDate } from 'common/utils/dateUtils';
import intlHelper from 'common/utils/intlUtils';
import { formatName } from 'common/utils/personUtils';
import { PleiepengesøknadApiData } from '../../../types/PleiepengesøknadApiData';
import { PleiepengesøknadFormData } from '../../../types/PleiepengesøknadFormData';
import { BarnReceivedFromApi } from '../../../types/Søkerdata';

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
                    navn: formatName(apiBarn.fornavn, apiBarn.etternavn, apiBarn.mellomnavn)
                }}
            />
        </Normaltekst>
        <Normaltekst>
            <FormattedMessage
                id="steg.oppsummering.barnet.fødselsdato"
                values={{
                    dato: prettifyDate(apiBarn.fødselsdato)
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
                        dato: prettifyDate(apiStringDateToDate(apiValues.barn.fødselsdato))
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

const BarnSummary: React.FunctionComponent<Props> = ({ formValues, apiValues, barn }) => {
    const intl = useIntl();
    const apiBarn = barn.find(({ aktørId }) => aktørId === formValues.barnetSøknadenGjelder);
    const useApiBarn = !formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0;

    return (
        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
            {useApiBarn && apiBarn && apiBarnSummary(apiBarn)}
            {!useApiBarn && annetBarnSummary(apiValues)}
        </ContentWithHeader>
    );
};

export default BarnSummary;
