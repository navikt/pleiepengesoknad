import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import ExpandableInfo from '@navikt/sif-common-core/lib/components/expandable-content/ExpandableInfo';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { ArbeidsforholdType } from '@navikt/sif-common-pleiepenger';
import { FrilansTyper } from '../../../../types/FrilansFormData';
import Box from '@navikt/sif-common-core/lib/components/box/Box';

interface Props {
    arbeidsforholdType: ArbeidsforholdType;
    frilansTyper?: FrilansTyper[];
}

const InfoArbeiderNormaltTimerIUken: React.FunctionComponent<Props> = ({ arbeidsforholdType, frilansTyper }) => {
    switch (arbeidsforholdType) {
        case ArbeidsforholdType.ANSATT:
            return <InfoArbeiderNormaltTimerAnsatt />;
        case ArbeidsforholdType.FRILANSER:
            return <InfoArbeiderNormaltTimerFrilanser frilansTyper={frilansTyper} />;
        case ArbeidsforholdType.SELVSTENDIG:
            return <InfoArbeiderNormaltTimerSN />;
    }
};

const InfoArbeiderNormaltTimerAnsatt = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.ansatt.normalTimer.info.tittel')}>
            <p>
                <FormattedMessage id={`arbeidsforhold.normalTimer.info.turnus`} />
            </p>

            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />
                <p>
                    <strong>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                    </strong>
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4a'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4b'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.5'} />
                </p>
            </ExpandableInfo>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.varierende.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.1'} />

                <p>
                    <strong>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                    </strong>
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                </p>
                <p>
                    <strong>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                    </strong>
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                </p>
            </ExpandableInfo>
        </ExpandableInfo>
    );
};

interface PropsFrilans {
    frilansTyper?: FrilansTyper[];
}

const InfoArbeiderNormaltTimerFrilanser = ({ frilansTyper }: PropsFrilans) => {
    const intl = useIntl();
    if (frilansTyper === undefined) {
        <></>;
    }
    return (
        <>
            <Box margin="l">
                {frilansTyper && frilansTyper.some((type) => type === FrilansTyper.FRILANS) && (
                    <ExpandableInfo
                        title={intlHelper(intl, 'arbeidsforhold.frilanser.normalTimer.frilans.info.tittel')}>
                        <FormattedMessage id={'arbeidsforhold.frilanser.normalTimer.frilans.info'} />
                    </ExpandableInfo>
                )}

                {frilansTyper && frilansTyper.some((type) => type === FrilansTyper.OMSORGSSTØNAD) && (
                    <ExpandableInfo
                        title={intlHelper(intl, 'arbeidsforhold.frilanser.normalTimer.omsorgsstønad.info.tittel')}>
                        <FormattedMessage id={'arbeidsforhold.frilanser.normalTimer.omsorgsstønad.info'} />
                    </ExpandableInfo>
                )}
                {frilansTyper && frilansTyper.some((type) => type === FrilansTyper.STYREVERV) && (
                    <ExpandableInfo
                        title={intlHelper(intl, 'arbeidsforhold.frilanser.normalTimer.styreverv.info.tittel')}>
                        <FormattedMessage id={'arbeidsforhold.frilanser.normalTimer.styreverv.info'} />
                    </ExpandableInfo>
                )}
            </Box>
        </>
    );
};

const InfoArbeiderNormaltTimerSN = () => {
    const intl = useIntl();
    return (
        <ExpandableInfo title={intlHelper(intl, 'arbeidsforhold.selvstendig.normalTimer.info.tittel')}>
            <p>
                <FormattedMessage id={`arbeidsforhold.normalTimer.info.turnus`} />
            </p>

            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.turnus.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.1'} />

                <p>
                    <strong>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.2'} />
                    </strong>
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4a'} />
                    <br />
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.4b'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.turnus.avsnitt.5'} />
                </p>
            </ExpandableInfo>
            <ExpandableInfo
                filledBackground={false}
                title={intlHelper(intl, 'arbeidsforhold.normalTimer.info.varierende.tittel')}>
                <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.1'} />

                <p>
                    <strong>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.2'} />
                    </strong>
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.3'} />
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.4'} />
                </p>
                <p>
                    <strong>
                        <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.5'} />
                    </strong>
                </p>
                <p>
                    <FormattedMessage id={'arbeidsforhold.normalTimer.info.varierende.avsnitt.6'} />
                </p>
            </ExpandableInfo>
        </ExpandableInfo>
    );
};

export default InfoArbeiderNormaltTimerIUken;
