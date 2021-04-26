import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Arbeidsform } from '../../types/PleiepengesøknadFormData';
import { Element } from 'nav-frontend-typografi';

interface Props {
    arbeidsform: Arbeidsform;
}

const ArbeidsformInfoSNFrilanser: React.FunctionComponent<Props> = ({ arbeidsform }) => {
    const intl = useIntl();
    switch (arbeidsform) {
        case Arbeidsform.varierende:
            return (
                <ExpandableInfo
                    title={intlHelper(intl, 'snFrilanser.arbeidsforhold.arbeidsform.varierende.info.tittel')}>
                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.1" />
                </ExpandableInfo>
            );
        case Arbeidsform.turnus:
            return (
                <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.arbeidsform.turnus.info.tittel')}>
                    <FormattedMessage id="arbeidsforhold.arbeidsform.turnus.info.tekst.1" />
                    <Box margin="l">
                        <Element tag="h3">
                            <FormattedMessage id="arbeidsforhold.arbeidsform.turnus.info.tekst.eksempel" />
                        </Element>
                        <p>
                            <FormattedMessage id="arbeidsforhold.arbeidsform.turnus.info.tekst.2" />
                        </p>
                        <p>
                            <FormattedMessage id="arbeidsforhold.arbeidsform.turnus.info.tekst.3" />
                            <br />
                            <FormattedMessage id="arbeidsforhold.arbeidsform.turnus.info.tekst.4" />
                            <br />
                            <FormattedMessage id="arbeidsforhold.arbeidsform.turnus.info.tekst.5" />
                            <br />
                        </p>
                        <p>
                            <FormattedMessage id="arbeidsforhold.arbeidsform.turnus.info.tekst.6" />
                        </p>
                    </Box>
                </ExpandableInfo>
            );
        default:
            return (
                <ExpandableInfo title={intlHelper(intl, 'snFrilanser.arbeidsforhold.arbeidsform.fast.info.tittel')}>
                    <FormattedMessage id="snFrilanser.arbeidsforhold.arbeidsform.fast.info.tekst" />
                </ExpandableInfo>
            );
    }
};

export default ArbeidsformInfoSNFrilanser;
