import React from 'react';
import { prettifyDateExtended } from '@navikt/sif-common-utils/lib';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Arbeidsgiver } from '../../../types';
import { FrilanserOppdragType } from '../../../types/FrilansFormData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../types/ArbeidsforholdFormValues';
import { FrilanserOppdragIPeriodenApi } from '../../../types/søknad-api-data/frilansOppdragApiData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const renderTidsromFrilansOppdrag = ({ ansattFom, ansattTom }: Arbeidsgiver) => {
    if (ansattFom && ansattTom) {
        return (
            <FormattedMessage
                id="frilansoppdragListe.tidsrom.avsluttet"
                values={{ fra: prettifyDateExtended(ansattFom), til: prettifyDateExtended(ansattTom) }}
            />
        );
    }
    if (ansattFom) {
        return (
            <FormattedMessage
                id="frilansoppdragListe.tidsrom.pågående"
                values={{ fra: prettifyDateExtended(ansattFom) }}
            />
        );
    }
    return undefined;
};

export const getFrilansOppdragIPeriodenRadios = (intl: IntlShape) => [
    {
        label: intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilanserOppdragIPeriodenApi.JA}`),
        value: FrilanserOppdragIPeriodenApi.JA,
    },
    {
        label: intlHelper(
            intl,
            `frilansoppdragListe.oppdrag.${FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN}`
        ),
        value: FrilanserOppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN,
    },
    {
        label: intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilanserOppdragIPeriodenApi.NEI}`),
        value: FrilanserOppdragIPeriodenApi.NEI,
    },
];

export const getSelectFrilansKategoriOptions = (intl: IntlShape) => {
    const førstOption = [
        <option key={0} value="">
            Velg kategori
        </option>,
    ];
    const options = Object.keys(FrilanserOppdragType).map((type, index) => (
        <option key={index + 1} value={type}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${type}`)}
        </option>
    ));
    return [...førstOption, ...options];
};

export const getFrilansOppdragIStyremedlemSvarRadios = (intl: IntlShape) => [
    {
        label: intlHelper(intl, `${YesOrNo.YES}`),
        value: YesOrNo.YES,
    },
    {
        label: intlHelper(intl, `${YesOrNo.NO}`),
        value: YesOrNo.NO,
    },
];

export const visFrilansOppdragNormalarbeidstid = (oppdrag: ArbeidsforholdFrilanserMedOppdragFormValues) =>
    oppdrag.frilansOppdragKategori &&
    (oppdrag.frilansOppdragKategori === FrilanserOppdragType.FRILANSER ||
        oppdrag.frilansOppdragKategori === FrilanserOppdragType.OMSORGSSTØNAD ||
        (oppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
            oppdrag.styremedlemHeleInntekt === YesOrNo.NO));
