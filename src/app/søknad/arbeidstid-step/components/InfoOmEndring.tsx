import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import FormattedHtmlMessage from '@navikt/sif-common-core/lib/components/formatted-html-message/FormattedHtmlMessage';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { useIntl } from 'react-intl';

interface Props {
    aktivitetType: 'arbeidstaker' | 'frilans' | 'sn';
}

const InfoOmEndring: React.FunctionComponent<Props> = ({ aktivitetType }) => {
    const intl = useIntl();
    switch (aktivitetType) {
        case 'arbeidstaker':
        case 'frilans':
            return (
                <ExpandableInfo title={intlHelper(intl, 'arbeidIPeriode.redusert.endring.tittel')}>
                    <FormattedHtmlMessage id="arbeidIPeriode.redusert.endring.arb_frilans.tekst" />
                </ExpandableInfo>
            );
        case 'sn':
            return (
                <ExpandableInfo title={intlHelper(intl, 'arbeidIPeriode.redusert.endring.tittel')}>
                    <FormattedHtmlMessage id="arbeidIPeriode.redusert.endring.sn.tekst" />
                </ExpandableInfo>
            );
    }
};

export default InfoOmEndring;
