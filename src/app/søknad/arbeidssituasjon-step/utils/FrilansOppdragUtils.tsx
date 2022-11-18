import React from 'react';
import { prettifyDateExtended } from '@navikt/sif-common-utils/lib';
import { FormattedMessage, IntlShape } from 'react-intl';
import { Arbeidsgiver } from '../../../types';
import { FrilansoppdragType } from '../../../types/FrilansoppdragFormData';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdFrilansoppdragFormValues } from '../../../types/ArbeidsforholdFormValues';
import { FrilansoppdragIPeriodenApi } from '../../../types/søknad-api-data/frilansoppdragApiData';
import { YesOrNo } from '@navikt/sif-common-formik/lib';

export const renderTidsrom = ({ ansattFom, ansattTom }: Arbeidsgiver) => {
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

export const getFrilansoppdragIPeriodenRadios = (intl: IntlShape) => [
    {
        label: intlHelper(
            intl,
            `steg.arbeidssituasjon.frilans.frilansoppdragIPeriodenRadios.${FrilansoppdragIPeriodenApi.JA}`
        ),
        value: FrilansoppdragIPeriodenApi.JA,
        'data-testid': `frilans-i-perioden_${FrilansoppdragIPeriodenApi.JA}`,
    },
    {
        label: intlHelper(
            intl,
            `steg.arbeidssituasjon.frilans.frilansoppdragIPeriodenRadios.${FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN}`
        ),
        value: FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN,
        'data-testid': `frilans-i-perioden_${FrilansoppdragIPeriodenApi.JA_MEN_AVSLUTTES_I_PERIODEN}`,
    },
    {
        label: intlHelper(
            intl,
            `steg.arbeidssituasjon.frilans.frilansoppdragIPeriodenRadios.${FrilansoppdragIPeriodenApi.NEI}`
        ),
        value: FrilansoppdragIPeriodenApi.NEI,
        'data-testid': `frilans-i-perioden_${FrilansoppdragIPeriodenApi.NEI}`,
    },
];

export const getSelectFrilansKategoriOptions = (intl: IntlShape) => {
    const førstOption = [
        <option key={0} value="">
            {intlHelper(intl, 'steg.arbeidssituasjon.frilans.frilansoppdragTypeOptions.velgKategori')}
        </option>,
    ];
    const options = Object.keys(FrilansoppdragType).map((type, index) => (
        <option key={index + 1} value={type}>
            {intlHelper(intl, `steg.arbeidssituasjon.frilans.frilansoppdragTypeOptions.${type}`)}
        </option>
    ));
    return [...førstOption, ...options];
};

export const getYesOrNoRadios = (intl: IntlShape, testId: string) => [
    {
        label: intlHelper(intl, `${YesOrNo.YES}`),
        value: YesOrNo.YES,
        'data-testid': `${testId}_yes`,
    },
    {
        label: intlHelper(intl, `${YesOrNo.NO}`),
        value: YesOrNo.NO,
        'data-testid': `${testId}_no`,
    },
];

export const visFrilansoppdragNormalarbeidstid = (oppdrag: ArbeidsforholdFrilansoppdragFormValues) =>
    oppdrag.frilansoppdragKategori &&
    (oppdrag.frilansoppdragKategori === FrilansoppdragType.FRILANSER ||
        oppdrag.frilansoppdragKategori === FrilansoppdragType.OMSORGSSTØNAD ||
        (oppdrag.frilansoppdragKategori === FrilansoppdragType.STYREMEDLEM_ELLER_VERV &&
            oppdrag.styremedlemHeleInntekt === YesOrNo.NO));
