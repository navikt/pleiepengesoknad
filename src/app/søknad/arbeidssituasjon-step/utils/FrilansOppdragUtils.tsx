import React from 'react';
import { prettifyDateExtended } from '@navikt/sif-common-utils/lib';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Arbeidsgiver } from '../../../types';
import { FrilansOppdragKategori, FrilansOppdragSvar, YesOrNoRadio } from '../../../types/FrilansFormData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdFrilanserMedOppdragFormValues } from '../../../types/ArbeidsforholdFormValues';

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
        <option key={1} value={FrilansOppdragKategori.FOSTERFORELDER}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilansOppdragKategori.FOSTERFORELDER}`)}
        </option>,
        <option key={2} value={FrilansOppdragKategori.FRILANSER}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilansOppdragKategori.FRILANSER}`)}
        </option>,
        <option key={3} value={FrilansOppdragKategori.OMSORGSSTØNAD}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilansOppdragKategori.OMSORGSSTØNAD}`)}
        </option>,
        <option key={4} value={FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV}>
            {intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV}`)}
        </option>,
    ];
};

export const visFrilansOppdragNormalarbeidstid = (oppdrag: ArbeidsforholdFrilanserMedOppdragFormValues) =>
    oppdrag.frilansOppdragKategori &&
    (oppdrag.frilansOppdragKategori === FrilansOppdragKategori.FRILANSER ||
        oppdrag.frilansOppdragKategori === FrilansOppdragKategori.OMSORGSSTØNAD ||
        (oppdrag.frilansOppdragKategori === FrilansOppdragKategori.STYREMEDLEM_ELLER_VERV &&
            oppdrag.styremedlemHeleInntekt === YesOrNoRadio.NEI));

export const getFrilansOppdragIPeriodenRadios = (intl: IntlShape) => [
    {
        label: intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilansOppdragSvar.JA}`),
        value: FrilansOppdragSvar.JA,
    },
    {
        label: intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilansOppdragSvar.JAAVSLUTESIPERIODEN}`),
        value: FrilansOppdragSvar.JAAVSLUTESIPERIODEN,
    },
    {
        label: intlHelper(intl, `frilansoppdragListe.oppdrag.${FrilansOppdragSvar.NEI}`),
        value: FrilansOppdragSvar.NEI,
    },
];

export const getFrilansOppdragIStyremedlemSvarRadios = (intl: IntlShape) => [
    {
        label: intlHelper(intl, `${YesOrNoRadio.JA}`),
        value: YesOrNoRadio.JA,
    },
    {
        label: intlHelper(intl, `${YesOrNoRadio.NEI}`),
        value: YesOrNoRadio.NEI,
    },
];
