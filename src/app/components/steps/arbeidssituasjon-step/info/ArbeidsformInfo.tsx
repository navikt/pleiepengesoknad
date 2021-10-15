import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ArbeidsforholdType, Arbeidsform } from '../../../../types';

interface Props {
    arbeidsform: Arbeidsform;
    arbeidsforholdType: ArbeidsforholdType;
    erAvsluttet: boolean;
}

const ArbeidsformInfo: React.FunctionComponent<Props> = ({ arbeidsform, arbeidsforholdType, erAvsluttet }) => {
    const intl = useIntl();

    if (arbeidsforholdType !== ArbeidsforholdType.ANSATT) {
        switch (arbeidsform) {
            case Arbeidsform.varierende:
                return (
                    <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.arbeidsform.varierende.info.tittel')}>
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
                    <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.arbeidsform.fast.info.tittel')}>
                        {arbeidsforholdType === ArbeidsforholdType.FRILANSER && (
                            <FormattedMessage
                                id={
                                    erAvsluttet
                                        ? 'arbeidsforhold.arbeidsform.avsluttet.frilanser.fast.info.tekst'
                                        : 'arbeidsforhold.arbeidsform.frilanser.fast.info.tekst'
                                }
                            />
                        )}
                        {arbeidsforholdType === ArbeidsforholdType.SELVSTENDIG && (
                            <FormattedMessage id="arbeidsforhold.arbeidsform.sn.fast.info.tekst" />
                        )}
                    </ExpandableInfo>
                );
        }
    }

    switch (arbeidsform) {
        case Arbeidsform.fast:
            return (
                <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.arbeidsform.fast.info.tittel')}>
                    <FormattedMessage
                        id={
                            erAvsluttet
                                ? 'arbeidsforhold.arbeidsform.avsluttet.fast.info.tekst'
                                : 'arbeidsforhold.arbeidsform.fast.info.tekst'
                        }
                    />
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
        case Arbeidsform.varierende:
            return (
                <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.arbeidsform.varierende.info.tittel')}>
                    <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.1" />
                    <Box margin="l">
                        <Element tag="h3">
                            <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.eksempel" />
                        </Element>
                        <p>
                            <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.2" />

                            <br />
                            <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.3" />
                        </p>
                        <p>
                            <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.4" />
                        </p>
                    </Box>
                    <Box margin="l">
                        <Element tag="h3">
                            <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.5" />
                        </Element>
                        <p>
                            <FormattedMessage id="arbeidsforhold.arbeidsform.varierende.info.tekst.6" />
                        </p>
                    </Box>
                </ExpandableInfo>
            );
    }
};

export default ArbeidsformInfo;
