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

export const getSelectFrilansKategoriOptions = (intl: IntlShape) => {
    return [
        <option key={0} value="">
            Velg kategori
        </option>,
        <option key={1} value={FrilanserOppdragType.FOSTERFORELDER}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilanserOppdragType.FOSTERFORELDER}`)}
        </option>,
        <option key={2} value={FrilanserOppdragType.FRILANSER}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilanserOppdragType.FRILANSER}`)}
        </option>,
        <option key={3} value={FrilanserOppdragType.OMSORGSSTØNAD}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilanserOppdragType.OMSORGSSTØNAD}`)}
        </option>,
        <option key={4} value={FrilanserOppdragType.STYREMEDLEM_ELLER_VERV}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilanserOppdragType.STYREMEDLEM_ELLER_VERV}`)}
        </option>,
    ];
};

export const visFrilansOppdragNormalarbeidstid = (oppdrag: ArbeidsforholdFrilanserMedOppdragFormValues) =>
    oppdrag.frilansOppdragKategori &&
    (oppdrag.frilansOppdragKategori === FrilanserOppdragType.FRILANSER ||
        oppdrag.frilansOppdragKategori === FrilanserOppdragType.OMSORGSSTØNAD ||
        (oppdrag.frilansOppdragKategori === FrilanserOppdragType.STYREMEDLEM_ELLER_VERV &&
            oppdrag.styremedlemHeleInntekt === YesOrNo.NO));

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
