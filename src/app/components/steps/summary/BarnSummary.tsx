import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import ContentWithHeader from '@navikt/sif-common/lib/common/components/content-with-header/ContentWithHeader';
import { apiStringDateToDate, prettifyDate } from '@navikt/sif-common/lib/common/utils/dateUtils';
import intlHelper from '@navikt/sif-common/lib/common/utils/intlUtils';
import { formatName } from '@navikt/sif-common/lib/common/utils/personUtils';
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
                    dato: prettifyDate(apiBarn.fodselsdato)
                }}
            />
        </Normaltekst>
    </>
);

const annetBarnSummary = (apiValues: PleiepengesøknadApiData) => (
    <>
        {apiValues.barn.fodselsdato ? (
            <Normaltekst>
                <FormattedMessage
                    id="steg.oppsummering.barnet.fødselsdato"
                    values={{
                        dato: prettifyDate(apiStringDateToDate(apiValues.barn.fodselsdato))
                    }}
                />
            </Normaltekst>
        ) : null}
        {!apiValues.barn.fodselsdato ? (
            <Normaltekst>
                <FormattedMessage id="steg.oppsummering.barnet.fnr" values={{ fnr: apiValues.barn.fodselsnummer }} />
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
    const apiBarn = barn.find(({ aktoer_id }) => aktoer_id === formValues.barnetSøknadenGjelder);
    const useApiBarn = !formValues.søknadenGjelderEtAnnetBarn && barn && barn.length > 0;

    return (
        <ContentWithHeader header={intlHelper(intl, 'steg.oppsummering.barnet.header')}>
            {useApiBarn && apiBarn && apiBarnSummary(apiBarn)}
            {!useApiBarn && annetBarnSummary(apiValues)}
        </ContentWithHeader>
    );
};

export default BarnSummary;
