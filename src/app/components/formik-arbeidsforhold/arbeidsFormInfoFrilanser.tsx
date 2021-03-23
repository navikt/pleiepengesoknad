import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Arbeidsform } from '../../types/PleiepengesøknadFormData';

interface Props {
    arbeidsform: Arbeidsform;
}

const ArbeidsformInfoFrilanser: React.FunctionComponent<Props> = ({ arbeidsform }) => {
    const intl = useIntl();
    switch (arbeidsform) {
        case Arbeidsform.varierende:
            return (
                <ExpandableInfo title={intlHelper(intl, 'frilanser.arbeidsforhold.arbeidsform.varierende.info.tittel')}>
                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.1" />
                </ExpandableInfo>
            );
        default:
            return (
                <ExpandableInfo title={intlHelper(intl, 'frilanser.arbeidsforhold.arbeidsform.fast.info.tittel')}>
                    <FormattedMessage id="frilanser.arbeidsforhold.arbeidsform.fast.info.tekst" />
                </ExpandableInfo>
            );
    }
};

export default ArbeidsformInfoFrilanser;
